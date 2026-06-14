import '../bar/bar.js';
import { WebComponent, each, movingIndicator } from 'webcomponent';
import { IconButtonBase } from '../icon-button/icon-button.js';
// `<ui-dock>` — a navigation rail. Composes a `<ui-bar>`, renders its `items`
// as `<ui-icon-button>`s, and tracks the selected item with a sliding
// active-bar driven by the shared movingIndicator engine. `activeId` is a prop
// — the consumer drives it (e.g. from the router); the dock never reads the
// router itself. Per-item `hidden` drops an item reactively.
export class UIDock extends WebComponent {
	static url = import.meta.url;
	static styles = {
		dock: './dock.css',
	};
	/*
	 * Per-theme RULE overrides (active-bar geometry, rail hairlines) in
	 * `./themes/{id}.css` — adopted by theme, absent files are graceful.
	 */
	static themes = ['gnosis', 'codex'];
	static state = {
		items: [],
		orientation: 'vertical',
		showActiveBar: true,
		activeId: '',
	};
	indicator = null;
	dockItems() {
		// Genuine computation feeding each(): drop hidden items, mark the
		// active one. Not a child `.state` fabricator — this is a list source.
		const items = this.state.items || [];
		const activeId = this.state.activeId || '';
		const out = [];
		for (let index = 0; index < items.length; index += 1) {
			const item = items[index];
			if (item.hidden) {
				continue;
			}
			out.push({
				id: item.id,
				icon: item.icon,
				tooltip: item.tooltip,
				animate: item.animate || '',
				onClick: item.onClick || 'dock:select',
				active: item.id === activeId,
			});
		}
		return out;
	}
	itemKey(item) {
		return item.id;
	}
	onConnect() {
		this.classList.toggle('dock-horizontal', this.state.orientation === 'horizontal');
		this.classList.toggle('dock-vertical', this.state.orientation !== 'horizontal');
		this.observeAsync('activeId', () => {
			this.syncActiveBar();
		});
		this.observeAsync('items', () => {
			requestAnimationFrame(() => {
				this.syncActiveBar();
			});
		});
		/*
		 * Reconcile AFTER subscribing. On a RECONNECT the observers re-register
		 * here while activeId may have changed since the disconnect — the
		 * mount-time snap only runs once, so catch up now. On first connect the
		 * indicator isn't built yet and this no-ops.
		 */
		this.syncActiveBar(true);
	}
	onMount() {
		this.indicator = movingIndicator(this.refs.active_bar, {
			prefix: 'bar',
		});
		this.delegate('viewport:resize', this.handleViewportChange);
		this.delegate('viewport:change', this.handleViewportChange);
		requestAnimationFrame(() => {
			this.syncActiveBar(true);
		});
	}
	onDisconnect() {
		this.indicator?.destroy();
		this.indicator = null;
	}
	handleViewportChange() {
		// Re-snap with no transition — the rail may have changed axis.
		this.syncActiveBar(true);
	}
	syncActiveBar(snap = false) {
		if (!this.indicator) {
			return;
		}
		if (!this.state.showActiveBar) {
			this.indicator.hide();
			return;
		}
		const activeId = this.state.activeId || '';
		const activeButton = activeId ? this.findComponent('ui-icon-button', (button) => {
			return button.state.id === activeId;
		}) : null;
		this.indicator.moveTo(activeButton, snap);
	}
	render() {
		this.html `
			<ui-bar class="dock">
				<div slot="center" class="dock-rail">
					<div class="active-bar" #active_bar></div>
					${each(this.dockItems(), IconButtonBase, this.itemKey)}
				</div>
			</ui-bar>
		`;
	}
}
customElements.define('ui-dock', UIDock);
