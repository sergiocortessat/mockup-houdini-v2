export const ORDER_STATUS = {
  WAITING: 0, // "inStatus":1
  CONFIRMING: 1, // "inStatus":2
  EXCHANGING: 2, // "inStatus":3
  ANONYMIZING: 3, // "inStatus":4
  COMPLETED: 4, // "inStatus":5
  EXPIRED: 5,
  FAILED: 6,
  REFUNDED: 7,
  DELETED: 8,
};

// Display-friendly 1-based status values for UI components
export const DISPLAY_ORDER_STATUS = Object.entries(ORDER_STATUS).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: value + 1,
  }),
  {} as Record<keyof typeof ORDER_STATUS, number>
);

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.WAITING]: 'waiting',
  [ORDER_STATUS.CONFIRMING]: 'confirming',
  [ORDER_STATUS.EXCHANGING]: 'exchanging',
  [ORDER_STATUS.ANONYMIZING]: 'anonymizing',
  [ORDER_STATUS.COMPLETED]: 'completed',
  [ORDER_STATUS.EXPIRED]: 'expired',
  [ORDER_STATUS.FAILED]: 'failed',
  [ORDER_STATUS.REFUNDED]: 'refunded',
  [ORDER_STATUS.DELETED]: 'deleted',
};

export const ORDER_STATUS_STEPS = [
  {
    step: DISPLAY_ORDER_STATUS.WAITING,
    title: ORDER_STATUS_LABELS[ORDER_STATUS.WAITING],
  },
  {
    step: DISPLAY_ORDER_STATUS.CONFIRMING,
    title: ORDER_STATUS_LABELS[ORDER_STATUS.CONFIRMING],
  },
  {
    step: DISPLAY_ORDER_STATUS.EXCHANGING,
    title: ORDER_STATUS_LABELS[ORDER_STATUS.EXCHANGING],
  },
  {
    step: DISPLAY_ORDER_STATUS.ANONYMIZING,
    title: ORDER_STATUS_LABELS[ORDER_STATUS.ANONYMIZING],
  },
  {
    step: DISPLAY_ORDER_STATUS.COMPLETED,
    title: ORDER_STATUS_LABELS[ORDER_STATUS.COMPLETED],
  },
];

export const TRACK_ORDER_POLLING_INTERVAL = 10000; // 10 seconds
export const SINGLE_ORDER_FALLBACK_POLLING_INTERVAL = 10000; // 10 seconds
export const MULTI_ORDER_POLLING_INTERVAL = 10000; // 10 seconds
export const LONGER_THAN_USUAL_MODAL_TIMEOUT_MS = 600000; // 10 minutes

export const SWAP_STATUS_STANDARD_AND_DEX = {
  IN_STATUS_1: 1, // waiting
  IN_STATUS_2: 2, // deposit detected
  IN_STATUS_3: 3, // swapping
  IN_STATUS_4: 4, // sending
  IN_STATUS_5: 5, // completed
};

export const SWAP_STATUS_PRIVATE = {
  IN_STATUS_1: 1, // waiting
  IN_STATUS_2: 2, // deposit detected
  IN_STATUS_3: 3, // swapping
  IN_STATUS_4: 4, // sending
  OUT_STATUS_2: 2, // exchange
  OUT_STATUS_3: 3, // swapping
  OUT_STATUS_4: 4, // sending
  OUT_STATUS_5: 5, // completed
};

export const SWAP_STATUS_STEPS_PRIVATE = [
  { step: 1, title: 'Waiting deposit to be detected' },
  { step: 2, title: 'Deposit detected for <ending of deposit address...>' },
  { step: 3, title: 'Sending <InTokenSymbol> to exchange 1' },
  { step: 4, title: 'Swapping <InTokenSymbol> to <HelperCircle>' },
  { step: 5, title: 'Sending <HelperCircle> to exchange 2' },
  { step: 6, title: 'Exchange 2 received <HelperCircle>' },
  { step: 7, title: 'Swapping <HelperCircle> to <OutTokenSymbol>' },
  { step: 8, title: 'Sending <OutTokenSymbol> to receiver address' },
  { step: 9, title: 'Swap completed' },
];

export const SWAP_STATUS_STEPS_STANDARD_AND_DEX = [
  { step: 1, title: 'Waiting deposit to be detected' },
  { step: 2, title: 'Deposit detected for <ending of deposit address...>' },
  { step: 3, title: 'Swapping <InTokenSymbol> to <OutTokenSymbol>' },
  { step: 4, title: 'Sending <OutTokenSymbol> to receiver address' },
  { step: 5, title: 'Swap completed' },
];
