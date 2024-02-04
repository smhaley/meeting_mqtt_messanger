import { publishAMessage } from "./MQTTHandler";
import { AppState } from "./AppState";
import { ToastTypes } from "./constants/toastTypes";
import { showToast } from "./Toast";

export const App = () => {
  const state = new AppState("ON AIR!!");

  const inputElement = document.getElementById(
    "messageInput"
  ) as HTMLInputElement;
  const pubButton = document.getElementById("mqttPubOn");
  const offButton = document.getElementById("mqttPubOff");

  window.addEventListener("load", function () {
    inputElement.value = state.messageValue;
    pubButton?.removeAttribute("disabled");
  });

  if (inputElement) {
    inputElement.oninput = (event: Event) => {
      const val = (event.target as HTMLInputElement).value;
      if (pubButton) {
        val.length < 1
          ? pubButton.setAttribute("disabled", "disabled")
          : pubButton.removeAttribute("disabled");
      }
      state.setMessageValue(val);
    };
  }

  pubButton?.addEventListener("click", () => {
    showToast("Published!", ToastTypes.PUBLISH);
    publishAMessage({
      status: "ON",
      message: state.messageValue.toUpperCase(),
    });
  });

  offButton?.addEventListener("click", () => {
    showToast("Message Canceled!", ToastTypes.CANCEL);
    publishAMessage({ status: "OFF" });
  });
};

export default App;
