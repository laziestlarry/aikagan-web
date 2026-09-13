export {};

declare global {
  interface Window {
    Paddle?: {
      Checkout?: {
        open: (config: { transactionId: string }) => Promise<void> | void;
      };
    };
  }
}
