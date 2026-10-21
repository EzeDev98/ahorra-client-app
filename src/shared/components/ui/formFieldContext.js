import { createContext, useContext } from 'react';

// FormField provides these to the control inside it: { id, labelId, describedBy, invalid }.
// Outside a FormField the value is an empty object, so controls still work on their own.
const FormFieldContext = createContext({});

export const FormFieldProvider = FormFieldContext.Provider;
export const useFormField = () => useContext(FormFieldContext);
