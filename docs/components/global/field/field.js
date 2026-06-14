import { WebComponent, classList } from '../../core/index.js';
export class UIField extends WebComponent {
	static url = import.meta.url;
	static styles = {
		field: './field.css',
	};
	static state = {
		label: '',
		help: '',
		error: '',
		required: false,
		inline: false,
		size: 'md',
	};
	get hintText() {
		return this.state.error || this.state.help;
	}
	render() {
		this.html `
			<div class=${classList(
				'field',
				() => {
					return `size-${this.state.size}`;
				},
				() => {
					return this.state.inline && 'is-inline';
				},
				() => {
					return this.state.error && 'has-error';
				},
				() => {
					return this.state.required && 'is-required';
				}
			)}>
				<label class="field-label" ?hidden=${() => {
					return !this.state.label;
				}}>${this.state.label}<span class="field-required" aria-hidden="true" ?hidden=${() => {
					return !this.state.required;
				}}> *</span></label>
				<div class="field-body"><slot></slot></div>
				<div class="field-hint" ?hidden=${() => {
					return !this.hintText;
				}}>${this.hintText}</div>
			</div>
		`;
	}
}
customElements.define('ui-field', UIField);
