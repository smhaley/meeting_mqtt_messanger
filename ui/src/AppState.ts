interface AppStateInterface {
  messageValue: string;
}

export class AppState implements AppStateInterface {
  public messageValue: string;

  constructor(messageValue?: string) {
    this.messageValue = messageValue ?? "";
  }

  public setMessageValue = (value: string) => {
    this.messageValue = value;
  };
}
