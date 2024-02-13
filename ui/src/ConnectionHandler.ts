import SharedStatusState, { AppHandshakeStatus} from "./SharedState";

export default class ConnectionHandler {
  private handlePush: () => void;
  private interval: number;
  private sharedStatusState: SharedStatusState;
  private mountEventName: string;
  private mqttConnectionFailure: Event;
  private handshakeTimeout: number;

  constructor(
    intervalMinutes: number,
    handshakeTimeout: number,
    sharedStatusState: SharedStatusState,
    mountEventName: string,
    mqttConnectionFailure: Event,
    handlePush: () => void
  ) {
    this.sharedStatusState = sharedStatusState;
    this.handshakeTimeout = handshakeTimeout;
    this.mountEventName = mountEventName;
    this.mqttConnectionFailure = mqttConnectionFailure;
    this.handlePush = handlePush;

    this.handleMQTTConnection();
    this.interval = window.setInterval(this.handshake, intervalMinutes * 60000);
  }

  private handleMQTTConnection = () =>
    document.addEventListener(this.mountEventName, this.handshake);

  public handshake = () => {
    this.handlePush();
    this.sharedStatusState.setStatus(AppHandshakeStatus.OPEN);
    setTimeout(() => {
      if (this.sharedStatusState.status === AppHandshakeStatus.OPEN) {
        document.dispatchEvent(this.mqttConnectionFailure);
        this.cleanup();
      }
    }, this.handshakeTimeout);
  };

  public closeStatus = () => this.sharedStatusState.setStatus(AppHandshakeStatus.CLOSED);
  private cleanup = () => {
    window.clearInterval(this.interval);
  };
}
