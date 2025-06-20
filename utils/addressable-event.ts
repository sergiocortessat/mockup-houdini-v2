declare global {
  interface Window {
    __adrsbl?: {
      queue: any[];
      run: (
        eventName: string,
        isConversion?: boolean,
        properties?: Array<{ name: string; value: any }>
      ) => void;
    };
  }
}

/**
 * Triggers an Addressable analytics event safely.
 */
export function triggerAddressableEvent(
  eventName: string,
  isConversion: boolean = false,
  properties?: Array<{ name: string; value: any }>
) {
  if (
    typeof window !== 'undefined' &&
    window.__adrsbl &&
    typeof window.__adrsbl.run === 'function'
  ) {
    window.__adrsbl.run(eventName, isConversion, properties);
  }
}
