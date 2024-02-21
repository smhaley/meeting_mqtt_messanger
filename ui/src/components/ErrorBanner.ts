export default class ErrorBanner extends HTMLElement {
  constructor() {
    super();
  }

  showBanner = () => {
    document.body.prepend(this);
  };

  connectedCallback() {
    this.innerHTML = `
    <div id="banner" class="warning-banner" aria-hidden="true">
      <div class="warning-content">Display not found!</div>
    </div>
  `;
  }
}

customElements.define("error-banner", ErrorBanner);
