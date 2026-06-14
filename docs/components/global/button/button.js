import { WebComponent, classList } from '../../core/index.js';
import { UIIcon } from '../icon/icon.js';
export class UIButton extends WebComponent {
	static url = import.meta.url;
	static styles = {
		button: './button.css',
	};
	static state = {
		tone: 'neutral',
		variant: 'solid',
		size: 'md',
		label: '',
		leadicon: '',
		trailicon: '',
		disabled: false,
		loading: false,
		fullwidth: false,
		title: '',
	};
	constructor(state = {}, config = {}) {
		super(state, {
			...config,
			tooltips: config.tooltips ?? Boolean((state ?? {}).title),
		});
	}
	/*
	 * Lead/trail render as ELEMENTS via htmlElement, never as ^html strings —
	 * a string-built `<ui-icon name="x">` carries a bare attribute, and bare
	 * attributes do not reach component state (UWC is property/state-first),
	 * so the icon renders blank. `.name=` props route through the accessor.
	 */
	renderLead() {
		if (this.state.loading) {
			return this.htmlElement `<span class="btn-spinner" aria-hidden="true"></span>`;
		}
		if (this.state.leadicon) {
			return this.htmlElement `<ui-icon class="btn-icon lead" .name=${this.state.leadicon} .size=${'sm'}></ui-icon>`;
		}
		return '';
	}
	renderTrail() {
		if (this.state.trailicon) {
			return this.htmlElement `<ui-icon class="btn-icon trail" .name=${this.state.trailicon} .size=${'sm'}></ui-icon>`;
		}
		return '';
	}
	renderLabel() {
		return this.state.label ? `<span class="btn-label">${this.state.label}</span>` : '';
	}
	handleClick(domEvent) {
		if (this.state.disabled || this.state.loading) {
			domEvent.preventDefault();
			domEvent.stopImmediatePropagation();
			return;
		}
		this.emit('buttonClick', {
			source: this,
		});
	}
	render() {
		this.html `
			<button
				data-variant=${() => {
					return this.state.variant || 'solid';
				}}
				data-tone=${() => {
					return this.state.tone || 'neutral';
				}}
				data-size=${() => {
					return this.state.size || 'md';
				}}
				class=${classList(
					() => {
						return this.state.disabled && 'is-disabled';
					},
					() => {
						return this.state.loading && 'is-loading';
					},
					() => {
						return this.state.fullwidth && 'is-full';
					},
					() => {
						return !this.state.label && 'is-icon-only';
					}
				)}
				?disabled=${this.state.disabled || this.state.loading}
				aria-label=${this.state.title || this.state.label}
				tooltip=${this.state.title}
				@click=${this.handleClick}>
				${this.renderLead}
				<slot name="lead"></slot>
				^html${this.renderLabel}
				<slot></slot>
				${this.renderTrail}
				<slot name="trail"></slot>
			</button>
		`;
	}
}
customElements.define('ui-button', UIButton);
// Keep UIIcon available so consumers reaching for an icon glyph next to UIButton don't have to add a separate import.
export { UIIcon };
