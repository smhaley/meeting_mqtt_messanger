import * as Paho from "paho-mqtt";
import * as MQTTConstants from "./constants/mqttConstants";

type ExportMessage = {
  status: "OFF" | "ON";
  message?: string;
};

const client = new Paho.Client(
  MQTTConstants.MQTT_CLIENT,
  MQTTConstants.MQTT_PORT,
  "client-" + Math.random().toString(36).slice(2, 9) + "-" + Date.now()
);

client.onMessageArrived = onMessageArrived;

client.connect({
  userName: MQTTConstants.MQTT_UN,
  password: MQTTConstants.MQTT_PW,
  onSuccess: onConnectionSuccess,
  onFailure: onConnectionFailure,
});

export const publishAMessage = (msg: ExportMessage) => {
  const message = new Paho.Message(JSON.stringify(msg));
  message.destinationName = MQTTConstants.MQTT_TOPIC;
  client.send(message);
};

function onConnectionSuccess() {
  console.log(
    `connection established. Pointing to the following Topic: ${MQTTConstants.MQTT_TOPIC}`
  );
}

function onConnectionFailure(err: { errorMessage: string }) {
  console.info("connect failed: " + err.errorMessage);
}

function onMessageArrived(message: any) {
  console.log("onMessageArrived:" + message.payloadString);
}
