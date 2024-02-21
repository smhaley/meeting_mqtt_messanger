import App from "./App";
import ConnectionHandler from "./services/ConnectionHandler";
import MQTTClient from "./services/MQTTClient";
import SharedStatusState from "./SharedState";
import CurrentMessageBanner from "./components/CurrentMessageBanner";
import Loader from "./components/Loader";
import * as actions from "./actions/actions";
import "../public/app.css";

const handshakeTimeout = Number(process.env.HANDSHAKE_TIMEOUT);
const timeoutInterval = Number(process.env.TIMEOUT_INTERVAL_MINUTES);

document.body.append(new Loader(handshakeTimeout));

const sharedStatusState = new SharedStatusState();
const mqttClient = new MQTTClient(
  sharedStatusState,
  actions.dispatchMqttMountEvent,
  actions.dispatchMessageUpdate
);
const connectionHandler = new ConnectionHandler(
  timeoutInterval,
  handshakeTimeout,
  sharedStatusState,
  actions.MQTT_MOUNTED,
  actions.dispatchMqttConnectionFailure,
  mqttClient.publishPingMessage
);

const app = new App(
  mqttClient.publishScreenMessage,
  connectionHandler.handshake,
  handshakeTimeout,
  actions.dispatchMessageUpdate
);
app.render();

document.addEventListener(
  actions.MQTT_CONNECTION_FAILURE,
  app.handleConnectionError
);

document.getElementById("main")?.prepend(new CurrentMessageBanner());
