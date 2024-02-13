export enum AppHandshakeStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export default class SharedStatusState {
  public status: AppHandshakeStatus = AppHandshakeStatus.CLOSED;

  public setStatus = (status: AppHandshakeStatus) => {
    this.status = status;
  };
}
