import { useEffect, useId, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import './EditEntrySheet.css';
import AmountField from '@shared/components/ui/AmountField.jsx';
import BottomSheet from '@shared/components/ui/BottomSheet.jsx';
import Button from '@shared/components/ui/Button.jsx';
import ChipSelect from '@shared/components/ui/ChipSelect.jsx';
import FormError from '@shared/components/ui/FormError.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import IconButton from '@shared/components/ui/IconButton.jsx';
import SelectField from '@shared/components/ui/SelectField.jsx';
import TextField from '@shared/components/ui/TextField.jsx';
import { formatMoney } from '@shared/utils/formatMoney.js';
import { DISCARD, ERRORS, FLOW_OPTIONS, LABELS, MAX_ITEMS, SHEET, VENDOR_MAX } from './editEntryContent.js';
import { draftTotal, toDraft, toEdits, validateDraft } from './editEntryRules.js';
import useCategories from './useCategories.js';


export default function EditEntrySheet({ entry, open, onClose, onConfirm, onDiscard, busy, discardBusy = false }) {
  const formId = useId();
  const form = useRef(null);
  const [draft, setDraft] = useState(() => toDraft(entry));
  const [errors, setErrors] = useState(null);
  const [problem, setProblem] = useState('');
  const [focusTick, setFocusTick] = useState(0);
  const [asking, setAsking] = useState(false); 
  const nextKey = useRef(draft.items.length);
  const { categories } = useCategories();

  const categoryOptions = categories.map((category) => ({ value: String(category.id), label: category.name }));
  if (entry.categoryId != null && !categoryOptions.some((option) => option.value === String(entry.categoryId))) {
    categoryOptions.unshift({ value: String(entry.categoryId), label: entry.categoryName ?? LABELS.category });
  }

  useEffect(() => {
    if (!focusTick) return;
    form.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [focusTick]);

  const edit = (change) => {
    setDraft(change);
    setErrors(null);
    setProblem('');
  };

  const setField = (name) => (value) => edit((current) => ({ ...current, [name]: value }));

  const setItem = (key, name) => (value) =>
    edit((current) => ({
      ...current,
      items: current.items.map((item) => (item.key === key ? { ...item, [name]: value } : item)),
    }));

  const addItem = () =>
    edit((current) => ({
      ...current,
      items: [...current.items, { key: nextKey.current++, description: '', amount: '' }],
    }));

  const removeItem = (key) => edit((current) => ({ ...current, items: current.items.filter((item) => item.key !== key) }));

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const found = validateDraft(draft);
    if (found.hasErrors) {
      setErrors(found);
      setFocusTick((tick) => tick + 1);
      return;
    }
    await onConfirm(toEdits(entry, draft), setProblem);
  };

  const working = busy || discardBusy;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      dismissible={!working}
      title={SHEET.title}
      footer={
        asking ? (
          <div className="edit-entry__ask" role="alert">
            <div className="edit-entry__ask-text">
              <p>{DISCARD.question}</p>
              <p className="edit-entry__ask-detail">{DISCARD.detail}</p>
            </div>
            <div className="edit-entry__ask-actions">
              <Button disabled={discardBusy} onClick={() => setAsking(false)}>
                {DISCARD.keep}
              </Button>
              <Button variant="secondary" busy={discardBusy} onClick={() => onDiscard(setProblem)}>
                {DISCARD.confirm}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {onDiscard && (
              <Button variant="ghost" className="edit-entry__discard" disabled={working} onClick={() => setAsking(true)}>
                {DISCARD.open}
              </Button>
            )}
            <Button variant="ghost" disabled={working} onClick={onClose}>
              {SHEET.cancel}
            </Button>
            <Button type="submit" form={formId} busy={busy} disabled={discardBusy}>
              {SHEET.confirm}
            </Button>
          </>
        )
      }
    >
      <form id={formId} ref={form} className="edit-entry" noValidate autoComplete="off" onSubmit={submit}>
        <FormField label={LABELS.flow}>
          <ChipSelect options={FLOW_OPTIONS} value={draft.flow} onChange={setField('flow')} disabled={busy} />
        </FormField>
        <FormField label={LABELS.vendor}>
          <TextField value={draft.vendor} maxLength={VENDOR_MAX} onChange={(event) => setField('vendor')(event.target.value)} />
        </FormField>
        {categoryOptions.length > 0 && (
          <FormField label={LABELS.category}>
            <SelectField
              options={categoryOptions}
              placeholder={LABELS.category}
              value={draft.categoryId}
              onChange={(event) => setField('categoryId')(event.target.value)}
              disabled={busy}
            />
          </FormField>
        )}
        <FormField label={LABELS.date} error={errors?.date ? ERRORS.date : undefined}>
          <TextField type="date" value={draft.entryDate} onChange={(event) => setField('entryDate')(event.target.value)} />
        </FormField>

        <div className="edit-entry__items">
          <p className="edit-entry__heading">{LABELS.items}</p>
          {draft.items.map((item, index) => {
            const problems = errors?.items[index];
            return (
              <div key={item.key} className="edit-entry__item">
                <FormField
                  label={LABELS.item(index + 1)}
                  error={problems?.description ? ERRORS.description : undefined}
                  className="edit-entry__description"
                >
                  <TextField
                    value={item.description}
                    onChange={(event) => setItem(item.key, 'description')(event.target.value)}
                  />
                </FormField>
                <FormField label={LABELS.amount} error={problems?.amount ? ERRORS.amount : undefined}>
                  <AmountField value={item.amount} onChange={setItem(item.key, 'amount')} />
                </FormField>
                {draft.items.length > 1 && (
                  <IconButton icon={Trash2} label={LABELS.removeItem(index + 1)} onClick={() => removeItem(item.key)} />
                )}
              </div>
            );
          })}
          {draft.items.length < MAX_ITEMS && (
            <Button variant="ghost" onClick={addItem}>
              <Plus aria-hidden="true" /> {LABELS.addItem}
            </Button>
          )}
        </div>

        <div className="edit-entry__total">
          <span>{LABELS.total}</span>
          <span>{formatMoney(draftTotal(draft))}</span>
        </div>
        <FormError>{problem}</FormError>
      </form>
    </BottomSheet>
  );
}
