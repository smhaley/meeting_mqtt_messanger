export enum MqttStatus {
  PING = "PING",
  PONG = "PONG",
}

export enum MessageStatus {
  ON = "ON",
  OFF = "OFF",
}

export type ImportMessage = {
  status: MqttStatus.PONG;
  currentMessage?: string;
};

export type ExportMessage = {
  status: MessageStatus.OFF | MessageStatus.ON | MqttStatus.PING;
  message?: string;
};
