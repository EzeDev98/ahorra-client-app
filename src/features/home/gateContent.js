export const GATE_COPY = {

  hardGate: (time) => `It is past ${time ?? 'the daily cut-off'}. Confirm your pending entries to continue.`,

  suspendedDay: (when, more) => `Entries from ${when} are still pending. Confirm them to continue.${more > 0 ? ` ${more} more ${more === 1 ? 'day' : 'days'} to go after that.` : ''}`,

  generic: 'Confirm your pending entries to continue.',
};
