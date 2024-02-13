import App from "./App";
import ConnectionHandler from "./ConnectionHandler";
import MQTTClient from "./MQTTHandler";
import SharedStatusState from "./SharedState";
import "../public/app.css";

const handshakeTimeout = Number(process.env.HANDSHAKE_TIMEOUT);
const timeoutInterval = Number(process.env.TIMEOUT_INTERVAL_MINUTES);

const MQTT_MOUNTED = "mqttMounted";
const MQTT_CONNECTION_FAILURE = "mqttConnectionFailure";

const mqttMountEvent = new Event(MQTT_MOUNTED);
const mqttConnectionFailure = new Event(MQTT_CONNECTION_FAILURE);

const sharedStatusState = new SharedStatusState();
const mqttClient = new MQTTClient(sharedStatusState, mqttMountEvent);
const connectionHandler = new ConnectionHandler(
  timeoutInterval,
  handshakeTimeout,
  sharedStatusState,
  MQTT_MOUNTED,
  mqttConnectionFailure,
  mqttClient.publishPingMessage
);

const app = new App(
  mqttClient.publishScreenMessage,
  connectionHandler.handshake,
  handshakeTimeout
);
app.render();

document.addEventListener(MQTT_CONNECTION_FAILURE, app.handleConnectionError);
