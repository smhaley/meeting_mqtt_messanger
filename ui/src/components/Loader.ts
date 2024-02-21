export default class Loader extends HTMLElement {
  private handshakeTimeout: number;
  constructor(handshakeTimeout: number) {
    super();
    this.handshakeTimeout = handshakeTimeout;
  }

  connectedCallback() {
    setTimeout(() => {
      this.remove();
      document.getElementById("main")?.setAttribute("aria-hidden", "false");
    }, this.handshakeTimeout);

    this.innerHTML = `
    <div id="loading-overlay" class="loading-overlay">
      <div class="loader"></div>
    </div>
  `;
  }
}

customElements.define("mount-loader", Loader);
