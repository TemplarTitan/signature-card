/*
	DESCRIPTION: ui-metric — a KPI / stat card: a label, a big value, an optional
	signed delta, and an optional trend sparkline. The dashboard's top-row atom.
	Composes <ui-sparkline> for the trend.
	── STANDARD INTERACTION ─────────────────────────────────────────────
	  <ui-metric .label=${'TPS (peak)'} .value=${'9,410'} .delta=${12.4}
	    .trend=${[3, 5, 4, 8, 7, 11, 9]} .tone=${'accent'}></ui-metric>
	`delta` is a signed number; rising reads success / falling reads danger —
	set `invertDelta` when down is good (e.g. latency). `deltaSuffix` defaults '%'.
	─────────────────────────────────────────────────────────────────────
*/
import '../sparkline/sparkline.js';
import { WebComponent, classList } from 'webcomponent';
function isNumber(value) {
	return typeof value === 'number' && Number.isFinite(value);
}
export class UIMetric extends WebComponent {
	static url = import.meta.url;
	static styles = {
		metric: './metric.css',
	};
	static state = {
		label: '',
		value: '',
		hint: '',
		tone: 'accent',
		delta: null,
		deltaSuffix: '%',
		invertDelta: false,
		trend: [],
	};
	get hasTrend() {
		return Array.isArray(this.state.trend) && this.state.trend.length > 1;
	}
	get deltaShown() {
		return isNumber(this.state.delta) && this.state.delta !== 0;
	}
	// Rising is good unless the metric is inverted (latency, error rate, …).
	deltaTone() {
		const rising = this.state.delta > 0;
		const good = this.state.invertDelta ? !rising : rising;
		return good ? 'success' : 'danger';
	}
	deltaText() {
		const arrow = this.state.delta > 0 ? '▲' : '▼';
		return `${arrow} ${Math.abs(this.state.delta)}${this.state.deltaSuffix}`;
	}
	render() {
		this.html `
			<div class=${classList('mtc', () => {
				return `tone-${this.state.tone}`;
			})}>
				<div class="mtc-head">
					<span class="mtc-label">${this.state.label}</span>
					<span class="mtc-hint" ?hidden=${() => {
						return !this.state.hint;
					}}>${this.state.hint}</span>
				</div>
				<div class="mtc-row">
					<span class="mtc-value">${this.state.value}</span>
					<span class=${classList('mtc-delta', () => {
						return `delta-${this.deltaTone()}`;
					})} ?hidden=${() => {
						return !this.deltaShown;
					}}>${this.deltaText}</span>
				</div>
				<ui-sparkline class="mtc-spark" ?hidden=${() => {
					return !this.hasTrend;
				}} .values=${this.state.trend} .variant=${'area'} .tone=${this.state.tone}></ui-sparkline>
			</div>
		`;
	}
}
customElements.define('ui-metric', UIMetric);
