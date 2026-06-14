/*
	One segment in a <ui-toggle-group>. Receives its item as-is ({value, label?,
	disabled?, active?}) and owns its whole render from those fields + defaults —
	the label falls back to the value here, not in a parent loop. Sizing inherits
	from the container's CSS custom properties. On click it emits `toggle-select`
	(detail.data.value); the parent owns the selection decision and stamps `active`
	back onto the bound item.
*/
import { WebComponent, classList } from 'webcomponent';
export class UIToggleOption extends WebComponent {
	static url = import.meta.url;
	static styles = {
		toggleOption: './toggle-option.css',
	};
	static state = {
		value: '',
		label: '',
		active: false,
		disabled: false,
	};
	handleClick() {
		if (this.state.disabled === true) {
			return;
		}
		this.emit('toggle-select', {
			value: this.state.value,
		});
	}
	focus() {
		this.refs.button?.focus();
	}
	render() {
		this.html `
			<button #button class=${classList(
				'tg-btn',
				() => {
					return this.state.active && 'is-active';
				}
			)}
				type="button"
				aria-pressed=${() => {
					return this.state.active ? 'true' : 'false';
				}}
				?disabled=${() => {
					return this.state.disabled === true;
				}}
				@click=${this.handleClick}>
				<span class="tg-label">${() => {
					return this.state.label || String(this.state.value ?? '');
				}}</span>
			</button>
		`;
	}
}
customElements.define('ui-toggle-option', UIToggleOption);
