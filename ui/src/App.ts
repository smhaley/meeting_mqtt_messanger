import { ExportMessage } from "./services/MQTTClient";
import { ToastTypes } from "./constants/toastTypes";
import { showToast } from "./components/Toast";
import { MessageStatus } from "./constants/mqttTransfer";
import ErrorBanner from "./components/ErrorBanner";

interface AppState {
  messageValue: string;
  hasError: boolean;
}

export default class App {
  private state: AppState = { messageValue: "ON AIR!!", hasError: false };
  private mqttHandshake: () => void;
  private sendTimeoutDuration: number;
  private dispatchMessage: (message?: string) => void;

  private inputElement: HTMLInputElement | null;
  private pubButton: HTMLButtonElement | null;
  private offButton: HTMLButtonElement | null;
  private toastBox: HTMLElement | null;

  private publishMessage: (
    msg: ExportMessage,
    errorCallback?: () => void
  ) => void;

  constructor(
    publishMessage: (msg: ExportMessage, errorCallback?: () => void) => void,
    mqttHandshake: () => void,
    sendTimeoutDuration: number,
    dispatchMessage: (message?: string) => void
  ) {
    this.publishMessage = publishMessage;
    this.mqttHandshake = mqttHandshake;
    this.sendTimeoutDuration = sendTimeoutDuration;
    this.dispatchMessage = dispatchMessage;

    this.inputElement = document.getElementById(
      "messageInput"
    ) as HTMLInputElement;
    this.pubButton = document.getElementById("mqttPubOn") as HTMLButtonElement;
    this.offButton = document.getElementById("mqttPubOff") as HTMLButtonElement;
    this.toastBox = document.getElementById("toastBox");
    this.initializeHandlers();
  }

  handleShowBanner = () => {
    new ErrorBanner().showBanner();
  };

  initializeHandlers = () => {
    window.addEventListener("load", () => {
      if (this.inputElement) {
        this.inputElement.value = this.state.messageValue;
        this.pubButton?.removeAttribute("disabled");
      }
    });

    this.pubButton?.addEventListener("click", () => {
      showToast("Publishing...", ToastTypes.PUBLISH, this.sendTimeoutDuration);
      this.handlePostSend();
      this.mqttHandshake();
      this.dispatchMessage(this.state.messageValue.toUpperCase());
      this.publishMessage(
        {
          status: MessageStatus.ON,
          message: this.state.messageValue.toUpperCase(),
        },
        this.handleConnectionError
      );
    });

    this.offButton?.addEventListener("click", () => {
      showToast("Cancelling...", ToastTypes.CANCEL, this.sendTimeoutDuration);
      this.handlePostSend();
      this.mqttHandshake();
      this.dispatchMessage(undefined);
      this.publishMessage(
        { status: MessageStatus.OFF },
        this.handleConnectionError
      );
    });
  };

  private handlePostSend = () => {
    if (this.pubButton && this.offButton) {
      this.pubButton.disabled = true;
      this.offButton.disabled = true;
    }
    setTimeout(() => {
      if (this.pubButton && this.offButton && !this.state.hasError) {
        this.pubButton.removeAttribute("disabled");
        this.offButton.removeAttribute("disabled");
      }
    }, this.sendTimeoutDuration);
  };

  public handleConnectionError = () => {
    this.state.hasError = true;
    this.handleShowBanner();
    this.toastBox?.classList.add("visuallyhidden");
    if (this.pubButton && this.offButton && this.inputElement) {
      this.pubButton.disabled = true;
      this.offButton.disabled = true;
      this.inputElement.disabled = true;
    }
  };

  render = () => {
    if (this.inputElement) {
      this.inputElement.oninput = (event: Event) => {
        const val = (event.target as HTMLInputElement).value;
        if (this.pubButton) {
          val.length < 1
            ? this.pubButton.setAttribute("disabled", "disabled")
            : this.pubButton.removeAttribute("disabled");
        }
        this.state.messageValue = val;
      };
    }
  };
}
