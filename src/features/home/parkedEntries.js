import { useSyncExternalStore } from 'react';

let state = { parked: new Set(), inBell: new Set(), returning: new Map() };
const listeners = new Set();

const update = (next) => {
  state = next;
  listeners.forEach((listener) => listener());
};

let watching = 0;

function sendBack(ids) {
  if (ids.length === 0) return ids;
  const parked = new Set(state.parked);
  const inBell = new Set(state.inBell);
  const returning = new Map(state.returning);
  ids.forEach((id, order) => {
    parked.delete(id);
    inBell.delete(id);
    returning.set(id, order);
  });
  update({ parked, inBell, returning });
  return ids;
}

export const parkedEntries = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,
  park: (id) => update({ ...state, parked: new Set(state.parked).add(String(id)) }),
  settle(id) {
    if (!state.parked.has(String(id))) return;
    update({ ...state, inBell: new Set(state.inBell).add(String(id)) });
  },
  clear() {
    if (state.parked.size === 0 && state.returning.size === 0) return;
    update({ parked: new Set(), inBell: new Set(), returning: new Map() });
  },
  release: () => sendBack([...state.inBell]),
  releaseAll: () => sendBack([...state.parked]),

  attach() {
    watching += 1;
    return () => {
      watching -= 1;
    };
  },

  resurface() {
    if (watching > 0) parkedEntries.releaseAll();
    else parkedEntries.clear();
  },

  finishReturn(ids) {
    if (!ids.some((id) => state.returning.has(id))) return;
    const returning = new Map(state.returning);
    ids.forEach((id) => returning.delete(id));
    update({ ...state, returning });
  },
};

export const useParked = () => useSyncExternalStore(parkedEntries.subscribe, parkedEntries.getSnapshot);
