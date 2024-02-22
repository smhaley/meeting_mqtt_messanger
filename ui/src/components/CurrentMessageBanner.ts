import { CURRENT_MESSAGE_UPDATE } from "../actions/actions";

export default class CurrentMessageBanner extends HTMLElement {
  private message?: string;
  private visible: boolean;

  constructor() {
    super();
    this.visible = false;
    this.setAttribute("aria-hidden", (!this.visible).toString());
  }

  private updateVisibility = () => {
    this.style.display = this.visible ? "block" : "none";
    this.setAttribute("aria-hidden", (!this.visible).toString());
  };

  private handleMessage = (e: CustomEvent<{ message?: string }>) => {
    this.message = e.detail.message;
    this.visible = !!(this.message && this.message.length);
    this.updateVisibility();
    this.innerHTML = `
  <div id="currentMessage" class="dot-container">
    <div class="dot dot--basic"></div>
    <div class="dot-container-message">${this.message}
    </div>
  </div>
`;
  };

  connectedCallback() {
    document.addEventListener(CURRENT_MESSAGE_UPDATE, this.handleMessage as EventListener);
  }

  disconnectedCallback() {
    document.removeEventListener(CURRENT_MESSAGE_UPDATE, this.handleMessage as EventListener);
  }
}

customElements.define("current-message-banner", CurrentMessageBanner);
