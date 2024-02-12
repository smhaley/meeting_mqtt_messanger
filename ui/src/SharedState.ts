export enum AppStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export default class SharedStatusState {
  public status: AppStatus = AppStatus.CLOSED;

  public setStatus = (status: AppStatus) => {
    this.status = status;
  };
}
