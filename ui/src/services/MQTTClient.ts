import * as Paho from "paho-mqtt";
import * as MQTTConstants from "../constants/mqttConstants";
import SharedStatusState, { AppHandshakeStatus } from "../SharedState";
import { MessageStatus, MqttStatus } from "../constants/mqttTransfer";

export type ExportMessage = {
  status: MessageStatus.OFF | MessageStatus.ON | MqttStatus.PING;
  message?: string;
};

export default class MQTTClient {
  private client: Paho.Client;
  private sharedStatusState: SharedStatusState;
  private dispatchMount: () => boolean;
  private dispatchMessageUpdate: (message: string) => void;

  constructor(
    sharedStatusState: SharedStatusState,
    dispatchMount: () => boolean,
    dispatchMessageUpdate: (message: string) => void
  ) {
    this.sharedStatusState = sharedStatusState;
    this.dispatchMount = dispatchMount;
    this.dispatchMessageUpdate = dispatchMessageUpdate;
    this.client = new Paho.Client(
      MQTTConstants.MQTT_CLIENT,
      MQTTConstants.MQTT_PORT,
      "client-" + Math.random().toString(36).slice(2, 9) + "-" + Date.now()
    );
    this.connectClient();
  }

  connectClient = () => {
    this.client.connect({
      timeout: 1,
      userName: MQTTConstants.MQTT_UN,
      password: MQTTConstants.MQTT_PW,
      onSuccess: this.onConnectionSuccess,
      onFailure: this.onConnectionFailure,
    });
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;
  };

  private onConnectionSuccess = () => {
    this.client.subscribe(MQTTConstants.MQTT_STATUS_TOPIC);
    this.dispatchMount();
    console.info(
      `Connection established. Pointing to the following Topics: ${MQTTConstants.MQTT_TOPIC}, ${MQTTConstants.MQTT_STATUS_TOPIC}`
    );
  };

  public publishScreenMessage = (
    msg: ExportMessage,
    errorCallback?: () => void
  ) => this.publishAMessage(msg, MQTTConstants.MQTT_TOPIC, errorCallback);

  public publishPingMessage = (errorCallback?: () => void) => {
    this.publishAMessage(
      { status: MqttStatus.PING },
      MQTTConstants.MQTT_STATUS_TOPIC,
      errorCallback
    );
  };

  private publishAMessage = (
    msg: ExportMessage,
    topic: string,
    errorCallback?: () => void
  ) => {
    try {
      const message = new Paho.Message(JSON.stringify(msg));
      message.destinationName = topic;
      this.client.send(message);
    } catch {
      errorCallback && errorCallback();
    }
  };

  onConnectionFailure = (err: { errorCode: number; errorMessage: string }) => {
    this.sharedStatusState.setStatus(AppHandshakeStatus.OPEN);
    console.info("connect failed: " + err.errorMessage);
  };

  private handleHandshake = (resp: {
    status: string;
    currentMessage?: string;
  }) => {
    const { status, currentMessage } = resp;
    const appCurrentMessage = this.sharedStatusState.currentMessage;

    const addMessage = currentMessage && currentMessage !== appCurrentMessage;
    const removeMessage = !currentMessage && appCurrentMessage;

    if (status === MqttStatus.PONG) {
      this.sharedStatusState.setStatus(AppHandshakeStatus.CLOSED);
      if (
        (addMessage || removeMessage) &&
        !this.sharedStatusState.initialHandshakeComplete
      ) {
        this.sharedStatusState.setCurrentMessage(currentMessage);
        currentMessage && this.dispatchMessageUpdate(currentMessage);
      }
      if (!this.sharedStatusState.initialHandshakeComplete) {
        this.sharedStatusState.setInitialHandshakeComplete(true);
      }
    }
  };

  onMessageArrived = (message: Paho.Message) => {
    try {
      const resp = JSON.parse(message.payloadString);
      this.handleHandshake(resp);
    } catch {
      console.error(`message parsing error: ${message.payloadString}`);
    }
  };

  onConnectionLost = (responseObject: {
    errorCode: number;
    errorMessage: string;
  }) => {
    this.sharedStatusState.setStatus(AppHandshakeStatus.OPEN);
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  };
}
