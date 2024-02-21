export enum AppHandshakeStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export default class SharedStatusState {
  public status: AppHandshakeStatus = AppHandshakeStatus.CLOSED;
  public currentMessage?: string;
  public initialHandshakeComplete: boolean = false;

  public setStatus = (status: AppHandshakeStatus) => (this.status = status);
  
  public setInitialHandshakeComplete = (isComplete: boolean) =>
    (this.initialHandshakeComplete = isComplete);

  public setCurrentMessage = (currentMessage?: string) =>
    (this.currentMessage = currentMessage);
}
