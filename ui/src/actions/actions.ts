export const MQTT_MOUNTED = "mqttMounted";
export const MQTT_CONNECTION_FAILURE = "mqttConnectionFailure";
export const CURRENT_MESSAGE_UPDATE = "currentMessageUpdate";

export const mqttMountEvent = new Event(MQTT_MOUNTED);
export const mqttConnectionFailure = new Event(MQTT_CONNECTION_FAILURE);

export const dispatchMqttMountEvent = () =>
  document.dispatchEvent(mqttMountEvent);

export const dispatchMqttConnectionFailure = () =>
  document.dispatchEvent(mqttConnectionFailure);

export const dispatchMessageUpdate = (message?: string) => {
  const messageUpdate = new CustomEvent<{ message?: string }>(
    CURRENT_MESSAGE_UPDATE,
    {
      detail: { message },
    }
  );
  document.dispatchEvent(messageUpdate);
};
