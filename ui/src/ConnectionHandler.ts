import SharedStatusState, { AppStatus } from "./SharedState";

export default class ConnectionHandler {
  private minutes: number;
  private handlePush: () => void;
  private interval: number;
  private sharedStatusState: SharedStatusState;
  private mountEventName: string;
  private mqttConnectionFailure: Event;

  constructor(
    minutes: number,
    sharedStatusState: SharedStatusState,
    mountEventName: string,
    mqttConnectionFailure: Event,
    handlePush: () => void
  ) {
    this.minutes = minutes;
    this.sharedStatusState = sharedStatusState;
    this.mountEventName = mountEventName;
    this.mqttConnectionFailure = mqttConnectionFailure;
    this.handlePush = handlePush;

    this.handleMQTTConnection();
    this.interval = window.setInterval(this.handshake, this.minutes * 60000);
  }

  private handleMQTTConnection = () =>
    document.addEventListener(this.mountEventName, this.handshake);

  public handshake = () => {
    this.handlePush();
    this.sharedStatusState.setStatus(AppStatus.OPEN);
    setTimeout(() => {
      if (this.sharedStatusState.status === AppStatus.OPEN) {
        document.dispatchEvent(this.mqttConnectionFailure);
        this.cleanup();
      }
    }, 2000);
  };

  public closeStatus = () => this.sharedStatusState.setStatus(AppStatus.CLOSED);
  private cleanup = () => {
    window.clearInterval(this.interval);
  };
}
