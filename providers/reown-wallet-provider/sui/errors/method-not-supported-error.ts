export class MethodNotSupportedError extends Error {
  public readonly method: string;
  public readonly walletId: string;

  constructor(walletId: string, method: string, log?: any) {
    super(`Wallet call is not supported`);
    this.name = 'MethodNotSupported';
    this.method = method;
    this.walletId = walletId;

    console.error(
      `SuiAdapter:MethodNotSupportedError:${walletId} - The connected wallet doesn't support the method "${method}".`,
      log
    );
  }
}
