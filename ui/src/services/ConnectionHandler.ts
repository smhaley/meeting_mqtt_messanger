import SharedStatusState, { AppHandshakeStatus } from "../SharedState";

export default class ConnectionHandler {
  private handlePush: () => void;
  private interval: number;
  private sharedStatusState: SharedStatusState;
  private mountEventName: string;
  private dispatchMqttConnectionFailure: () => boolean;
  private handshakeTimeout: number;

  constructor(
    intervalMinutes: number,
    handshakeTimeout: number,
    sharedStatusState: SharedStatusState,
    mountEventName: string,
    dispatchMqttConnectionFailure: () => boolean,
    handlePush: () => void
  ) {
    this.sharedStatusState = sharedStatusState;
    this.handshakeTimeout = handshakeTimeout;
    this.mountEventName = mountEventName;
    this.dispatchMqttConnectionFailure = dispatchMqttConnectionFailure;
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
        this.dispatchMqttConnectionFailure();
        this.cleanup();
      }
    }, this.handshakeTimeout);
  };

  public closeStatus = () =>
    this.sharedStatusState.setStatus(AppHandshakeStatus.CLOSED);
  private cleanup = () => {
    window.clearInterval(this.interval);
  };
}
