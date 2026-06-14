import { WebComponent, classList } from '../../core/index.js';
export class UISurface extends WebComponent {
	static url = import.meta.url;
	static styles = {
		surface: './surface.css',
	};
	static state = {
		tone: 'panel',
		padding: 'md',
		radius: 'md',
		elevation: '0',
		border: false,
		interactive: false,
	};
	render() {
		this.html `
			<div class=${classList(
				'sf',
				() => {
					return `sf-tone-${this.state.tone}`;
				},
				() => {
					return `sf-pad-${this.state.padding}`;
				},
				() => {
					return `sf-radius-${this.state.radius}`;
				},
				() => {
					return `sf-elev-${this.state.elevation}`;
				},
				() => {
					return this.state.border && 'sf-has-border';
				},
				() => {
					return this.state.interactive && 'sf-is-interactive';
				}
			)}>
				<slot></slot>
			</div>
		`;
	}
}
customElements.define('ui-surface', UISurface);
