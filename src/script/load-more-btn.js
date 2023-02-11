export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    refs.loadLabel = refs.button.querySelector('.load-text');
    refs.spinner = refs.button.querySelector('#load-animation');

    return refs;
  }

  async enable() {
    this.refs.button.disabled = false;
    this.refs.spinner.classList.add('is-hidden');
    this.refs.loadLabel.classList.remove('is-hidden');
  }

  async disable() {
    this.refs.button.disabled = true;
    this.refs.spinner.classList.remove('is-hidden');
    this.refs.loadLabel.classList.add('is-hidden');
  }

  show() {
    this.refs.button.classList.remove('is-hidden');
  }

  hide() {
    this.refs.button.classList.add('is-hidden');
  }
}
