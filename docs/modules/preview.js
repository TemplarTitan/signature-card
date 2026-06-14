import './registerRoots.js';
/* paged-list (root `paged`) + ui-stat-table (dir name ≠ resolver rest) don't
   auto-resolve through registerRoots, so define them by side-effect import. */
import '../components/global/paged-list/paged-list.js';
import '../components/global/ui-stat-table/ui-stat-table.js';
import { WebComponent, html } from 'webcomponent';
import { BootScreen } from '../components/global/boot-screen/boot-screen.js';
class PreviewView extends WebComponent {
	static id = 'preview-view';
	static url = import.meta.url;
	static styles = {
		preview: './preview.css',
	};
	static state = {
		emailValue: '',
		searchValue: '',
		amountValue: '',
		clickCount: 0,
		spinDemo: false,
		badgeCount: 1,
		confirmResult: '(awaiting action)',
		selectValue: 'viat',
		statusValue: 'online',
		/* Gallery nav. `activeCategory` filters the stage; `navQuery` is the live
		   name filter. Category ids must match each section's demoHidden(cat,…). */
		activeCategory: 'all',
		navQuery: '',
		categories: [
			{
				id: 'all',
				label: 'All',
				icon: 'layout-grid',
			},
			{
				id: 'layout',
				label: 'Layout',
				icon: 'layout-dashboard',
			},
			{
				id: 'typography',
				label: 'Typography',
				icon: 'type',
			},
			{
				id: 'forms',
				label: 'Forms',
				icon: 'text-cursor-input',
			},
			{
				id: 'actions',
				label: 'Actions',
				icon: 'square-mouse-pointer',
			},
			{
				id: 'feedback',
				label: 'Feedback',
				icon: 'activity',
			},
			{
				id: 'data',
				label: 'Data',
				icon: 'table',
			},
			{
				id: 'overlays',
				label: 'Overlays',
				icon: 'layers',
			},
			{
				id: 'shell',
				label: 'Shell',
				icon: 'panels-top-left',
			},
		],
		selectOptions: [
			{
				value: 'viat',
				label: 'VIAT · settlement layer',
			},
			{
				value: 'udsp',
				label: 'UDSP · transport',
			},
			{
				value: 'uwc',
				label: 'UWC · components',
			},
			{
				value: 'legacy',
				label: 'Legacy (disabled)',
				disabled: true,
			},
		],
		statTableColumns: [
			{
				id: 'metric',
				label: 'METRIC',
				width: '1.4fr',
			},
			{
				id: 'value',
				label: 'VALUE',
				width: '1fr',
			},
			{
				id: 'delta',
				label: '24H',
				width: '0.8fr',
			},
		],
		statTableRows: [
			{
				metric: 'Block height',
				value: '4,182,907',
				delta: '+312',
			},
			{
				metric: 'Validators',
				value: '128',
				delta: '+2',
			},
			{
				metric: 'TPS (peak)',
				value: '9,410',
				delta: '+1.2K',
			},
			{
				metric: 'Finality',
				value: '1.8s',
				delta: '−0.1s',
			},
		],
		toolbarActions: [
			{
				icon: 'bold',
				tooltip: 'Bold',
			},
			{
				icon: 'italic',
				tooltip: 'Italic',
			},
			{
				icon: 'underline',
				tooltip: 'Underline',
			},
			{
				icon: 'list',
				tooltip: 'List',
			},
			{
				icon: 'code',
				tooltip: 'Code',
			},
		],
		dockItems: [
			{
				id: 'wallet',
				icon: 'wallet',
				tooltip: 'Wallet',
				animate: 'bob',
			},
			{
				id: 'explorer',
				icon: 'compass',
				tooltip: 'Explorer',
				animate: 'compass',
			},
			{
				id: 'accounts',
				icon: 'users',
				tooltip: 'Accounts',
				animate: 'hop',
			},
			{
				id: 'swap',
				icon: 'arrow-left-right',
				tooltip: 'Swap',
				animate: 'flip',
			},
		],
		dockActiveId: 'explorer',
		appBarActions: [
			{
				id: 'agent',
				icon: 'bot',
				tooltip: 'Local Agent',
			},
			{
				id: 'settings',
				icon: 'settings',
				tooltip: 'Settings',
			},
			{
				id: 'sidebar',
				icon: 'panel-left',
				tooltip: 'Sidebar',
			},
		],
		statusCells: [
			{
				label: 'Client',
				value: 'Web',
			},
			{
				label: 'Network',
				value: 'MAINNET',
			},
			{
				label: 'Version',
				value: 'v1.0.0',
			},
		],
	};
	static async create(state, config) {
		const view = new this(await state, config);
		await WebComponent.preRender(view, document.body);
		return view;
	}
	/* Stable display+data contract for the <paged-list> demo (mirrors the
	   explorer's instance-field pattern; the loader arrow preserves `this`). */
	listConfig = {
		loader: (options) => {
			return this.loadPagedDemo(options);
		},
		renderRow: this.pagedRow,
		renderHead: this.pagedHead,
		keyFn: (row) => {
			return row.id;
		},
		itemNoun: 'rows',
		emptyText: 'No rows.',
		loadingText: 'Loading rows…',
		pagingStyle: 'loadmore',
	};
	bumpClick() {
		this.state.clickCount = this.state.clickCount + 1;
	}
	bumpBadge() {
		this.state.badgeCount = this.state.badgeCount + 1;
	}
	toggleSpin() {
		this.state.spinDemo = !this.state.spinDemo;
	}
	syncEmail(domEvent) {
		this.state.emailValue = domEvent.detail.data.value;
	}
	syncSearch(domEvent) {
		this.state.searchValue = domEvent.detail.data.value;
	}
	syncAmount(domEvent) {
		this.state.amountValue = domEvent.detail.data.value;
	}
	openModal() {
		this.refs.modal.open();
	}
	closeModal() {
		this.refs.modal.close();
	}
	openControlsModal() {
		this.refs.controls_modal.open();
	}
	openMacModal() {
		this.refs.mac_modal.open();
	}
	openMaximizedStartModal() {
		// Demonstrates the afterAction continuation hook — fires once when
		// the modal closes, regardless of path (button, Escape, backdrop).
		this.refs.after_action_modal.assignState({
			afterAction: ({ returnValue }) => {
				this.state.confirmResult = `modal closed with returnValue=${returnValue || '(empty)'}`;
			},
		});
		this.refs.after_action_modal.open();
	}
	notifyDefault() {
		this.refs.notify.show({
			title: 'Heads up',
			message: 'A default notification just landed.',
		});
	}
	notifyError() {
		this.refs.notify.show({
			title: 'Transfer failed',
			message: 'The node rejected the transaction.',
			itemType: 'error',
		});
	}
	showLoadingScreen() {
		const loadingScreen = this.refs.loading;
		loadingScreen.open({
			title: 'Syncing chain',
			message: 'Verifying post-quantum proofs…',
		});
		this.setTimeout(() => {
			loadingScreen.close();
		}, 2000);
	}
	showBootScreen() {
		const bootScreen = new BootScreen();
		document.body.appendChild(bootScreen);
		this.setTimeout(() => {
			bootScreen.dismiss();
		}, 2200);
	}
	async doDestructiveAction() {
		const accepted = await this.confirm('Delete this wallet? This action cannot be undone.');
		const timestamp = new Date().toLocaleTimeString();
		this.state.confirmResult = accepted ? `confirmed at ${timestamp}` : `cancelled at ${timestamp}`;
	}
	setCategory(domEvent) {
		const categoryId = domEvent.currentTarget?.dataset?.id;
		if (categoryId) {
			this.state.activeCategory = categoryId;
		}
	}
	/**
	 * Visibility predicate for a demo card — true = hidden. A card shows when the
	 * active category matches (or 'all') AND its name matches the live query.
	 * @param {string} category - The card's category id.
	 * @param {string} searchName - The card's searchable label.
	 * @returns {boolean} Whether the card should be hidden.
	 */
	demoHidden(category, searchName) {
		const active = this.state.activeCategory;
		const categoryOk = active === 'all' || active === category;
		const query = this.state.navQuery.trim().toLowerCase();
		const queryOk = query === '' || searchName.toLowerCase().includes(query);
		return !(categoryOk && queryOk);
	}
	syncSelect(domEvent) {
		this.state.selectValue = domEvent.detail?.data?.value ?? domEvent.target.value;
	}
	cycleStatus() {
		const order = [
			'online', 'connecting', 'offline',
		];
		const next = order[(order.indexOf(this.state.statusValue) + 1) % order.length];
		this.state.statusValue = next;
	}
	openWhitebox() {
		this.refs.whitebox?.open();
	}
	loadPagedDemo(options) {
		// Synthetic in-memory loader (3 pages × 8 rows) — no SDK, no network.
		const page = options.reset ? 1 : (options.cursor ?? 1);
		const totalPages = 3;
		const pageSize = 8;
		const start = (page - 1) * pageSize;
		const rows = new Array(pageSize);
		for (let offset = 0; offset < pageSize; offset++) {
			const rowIndex = start + offset + 1;
			rows[offset] = {
				id: rowIndex,
				hash: `0x${rowIndex.toString(16).padStart(6, '0')}`,
				amount: (rowIndex * 3.14).toFixed(2),
			};
		}
		return Promise.resolve({
			items: rows,
			nextCursor: page < totalPages ? page + 1 : null,
			hasMore: page < totalPages,
			totalCount: totalPages * pageSize,
		});
	}
	pagedRow(row) {
		return html `
			<div class="demo-paged-row">
				<span class="demo-mono demo-paged-id">#${row.id}</span>
				<span class="demo-mono">${row.hash}</span>
				<span class="demo-mono demo-paged-amount">${row.amount} VIAT</span>
			</div>
		`;
	}
	pagedHead() {
		return html `
			<div class="demo-paged-row demo-paged-head">
				<span class="demo-mono">#</span>
				<span class="demo-mono">HASH</span>
				<span class="demo-mono demo-paged-amount">AMOUNT</span>
			</div>
		`;
	}
	render() {
		this.html `
			<div class="gallery">
				<aside class="rail">
					<div class="rail-brand">
						<span class="rail-glyph">⩝</span>
						<span class="rail-brand-text">VIAT<small>component index</small></span>
					</div>
					<label class="rail-search">
						<ui-icon class="rail-search-icon" .state=${{
							name: 'search',
							size: 'sm',
							tone: 'muted',
						}}></ui-icon>
						<input class="rail-search-input" type="search" placeholder="filter…" $value="navQuery">
					</label>
					<nav class="rail-nav">
						<button class="rail-cat" data-id="all" ?data-on=${this.state.activeCategory === 'all'} @click=${this.setCategory}>
							<ui-icon class="rail-cat-icon" .state=${{
								name: 'layout-grid',
								size: 'sm',
							}}></ui-icon><span class="rail-cat-label">All</span>
						</button>
						<button class="rail-cat" data-id="layout" ?data-on=${this.state.activeCategory === 'layout'} @click=${this.setCategory}>
							<ui-icon class="rail-cat-icon" .state=${{
								name: 'layout-dashboard',
								size: 'sm',
							}}></ui-icon><span class="rail-cat-label">Layout</span>
						</button>
						<button class="rail-cat" data-id="typography" ?data-on=${this.state.activeCategory === 'typography'} @click=${this.setCategory}>
							<ui-icon class="rail-cat-icon" .state=${{
								name: 'type',
								size: 'sm',
							}}></ui-icon><span class="rail-cat-label">Typography</span>
						</button>
						<button class="rail-cat" data-id="forms" ?data-on=${this.state.activeCategory === 'forms'} @click=${this.setCategory}>
							<ui-icon class="rail-cat-icon" .state=${{
								name: 'text-cursor-input',
								size: 'sm',
							}}></ui-icon><span class="rail-cat-label">Forms</span>
						</button>
						<button class="rail-cat" data-id="actions" ?data-on=${this.state.activeCategory === 'actions'} @click=${this.setCategory}>
							<ui-icon class="rail-cat-icon" .state=${{
								name: 'square-mouse-pointer',
								size: 'sm',
							}}></ui-icon><span class="rail-cat-label">Actions</span>
						</button>
						<button class="rail-cat" data-id="feedback" ?data-on=${this.state.activeCategory === 'feedback'} @click=${this.setCategory}>
							<ui-icon class="rail-cat-icon" .state=${{
								name: 'activity',
								size: 'sm',
							}}></ui-icon><span class="rail-cat-label">Feedback</span>
						</button>
						<button class="rail-cat" data-id="data" ?data-on=${this.state.activeCategory === 'data'} @click=${this.setCategory}>
							<ui-icon class="rail-cat-icon" .state=${{
								name: 'table',
								size: 'sm',
							}}></ui-icon><span class="rail-cat-label">Data</span>
						</button>
						<button class="rail-cat" data-id="overlays" ?data-on=${this.state.activeCategory === 'overlays'} @click=${this.setCategory}>
							<ui-icon class="rail-cat-icon" .state=${{
								name: 'layers',
								size: 'sm',
							}}></ui-icon><span class="rail-cat-label">Overlays</span>
						</button>
						<button class="rail-cat" data-id="shell" ?data-on=${this.state.activeCategory === 'shell'} @click=${this.setCategory}>
							<ui-icon class="rail-cat-icon" .state=${{
								name: 'panels-top-left',
								size: 'sm',
							}}></ui-icon><span class="rail-cat-label">Shell</span>
						</button>
					</nav>
					<div class="rail-foot">
						<ui-text .variant=${'overline'} .tone=${'muted'}>theme</ui-text>
						<ui-theme-select></ui-theme-select>
					</div>
				</aside>
				<main class="stage">
					<header class="stage-head">
						<ui-text .variant=${'display'} .tone=${'accent'}>Component Index</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>tier-0 atoms · viat / universal-web-components · this gallery is built from the components it shows</ui-text>
					</header>

					<section class="demo" data-cat="layout" ?hidden=${() => {
						return this.demoHidden('layout', 'UISurface surface tones');
					}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UISurface</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>tones · padding · radius · elevation · interactive</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<div class="grid">
							<ui-surface .state=${{
								tone: 'panel',
								padding: 'md',
								radius: 'md',
							}}><ui-text .variant=${'caption'} .tone=${'muted'}>panel</ui-text></ui-surface>
							<ui-surface .state=${{
								tone: 'subtle',
								padding: 'md',
								radius: 'md',
							}}><ui-text .variant=${'caption'} .tone=${'muted'}>subtle</ui-text></ui-surface>
							<ui-surface .state=${{
								tone: 'popup',
								padding: 'md',
								radius: 'md',
							}}><ui-text .variant=${'caption'} .tone=${'muted'}>popup</ui-text></ui-surface>
							<ui-surface .state=${{
								tone: 'success',
								padding: 'md',
								radius: 'md',
							}}><ui-text .variant=${'caption'} .tone=${'muted'}>success</ui-text></ui-surface>
							<ui-surface .state=${{
								tone: 'danger',
								padding: 'md',
								radius: 'md',
							}}><ui-text .variant=${'caption'} .tone=${'muted'}>danger</ui-text></ui-surface>
							<ui-surface .state=${{
								tone: 'accent',
								padding: 'md',
								radius: 'md',
								elevation: '2',
							}}><ui-text .variant=${'caption'} .tone=${'muted'}>accent · elev 2</ui-text></ui-surface>
							<ui-surface .state=${{
								tone: 'panel',
								padding: 'md',
								radius: 'md',
								elevation: '3',
								border: true,
							}}><ui-text .variant=${'caption'} .tone=${'muted'}>panel · elev 3 · border</ui-text></ui-surface>
							<ui-surface .state=${{
								tone: 'panel',
								padding: 'md',
								radius: 'md',
								interactive: true,
								border: true,
							}}><ui-text .variant=${'caption'} .tone=${'muted'}>interactive · hover</ui-text></ui-surface>
						</div>
					</ui-surface>
				</section>

				<section class="demo" data-cat="layout" ?hidden=${() => {
					return this.demoHidden('layout', 'UIStack stack layout flex');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIStack</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>flex layout · direction · gap · align · justify</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<div class="cluster">
							<ui-surface .state=${{
								tone: 'subtle',
								padding: 'md',
								radius: 'md',
							}}>
								<ui-stack .state=${{
									direction: 'row',
									gap: 'sm',
								}}>
									<ui-surface .state=${{
										tone: 'accent',
										padding: 'sm',
										radius: 'sm',
									}}><ui-text .variant=${'caption'}>A</ui-text></ui-surface>
									<ui-surface .state=${{
										tone: 'accent',
										padding: 'sm',
										radius: 'sm',
									}}><ui-text .variant=${'caption'}>B</ui-text></ui-surface>
									<ui-surface .state=${{
										tone: 'accent',
										padding: 'sm',
										radius: 'sm',
									}}><ui-text .variant=${'caption'}>C</ui-text></ui-surface>
								</ui-stack>
							</ui-surface>
							<ui-surface .state=${{
								tone: 'subtle',
								padding: 'md',
								radius: 'md',
							}}>
								<ui-stack .state=${{
									direction: 'column',
									gap: 'md',
								}}>
									<ui-surface .state=${{
										tone: 'accent',
										padding: 'sm',
										radius: 'sm',
									}}><ui-text .variant=${'caption'}>A</ui-text></ui-surface>
									<ui-surface .state=${{
										tone: 'accent',
										padding: 'sm',
										radius: 'sm',
									}}><ui-text .variant=${'caption'}>B</ui-text></ui-surface>
									<ui-surface .state=${{
										tone: 'accent',
										padding: 'sm',
										radius: 'sm',
									}}><ui-text .variant=${'caption'}>C</ui-text></ui-surface>
								</ui-stack>
							</ui-surface>
							<ui-surface .state=${{
								tone: 'subtle',
								padding: 'md',
								radius: 'md',
							}}>
								<ui-stack .state=${{
									direction: 'row',
									gap: 'lg',
									justify: 'between',
								}}>
									<ui-surface .state=${{
										tone: 'accent',
										padding: 'sm',
										radius: 'sm',
									}}><ui-text .variant=${'caption'}>A</ui-text></ui-surface>
									<ui-surface .state=${{
										tone: 'accent',
										padding: 'sm',
										radius: 'sm',
									}}><ui-text .variant=${'caption'}>B</ui-text></ui-surface>
									<ui-surface .state=${{
										tone: 'accent',
										padding: 'sm',
										radius: 'sm',
									}}><ui-text .variant=${'caption'}>C</ui-text></ui-surface>
								</ui-stack>
							</ui-surface>
						</div>
					</ui-surface>
				</section>

				<section class="demo" data-cat="typography" ?hidden=${() => {
					return this.demoHidden('typography', 'UIText text typography heading');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIText</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>variants · tones</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'column',
							gap: 'sm',
						}}>
							<ui-text .variant=${'display'}>Display heading</ui-text>
							<ui-text .variant=${'h1'}>Heading 1</ui-text>
							<ui-text .variant=${'h2'}>Heading 2</ui-text>
							<ui-text .variant=${'h3'} .tone=${'accent'}>Heading 3 · accent</ui-text>
							<ui-text .variant=${'body'}>Body copy stays readable at the comfortable default size.</ui-text>
							<ui-text .variant=${'caption'} .tone=${'muted'}>Caption · muted tone for secondary info</ui-text>
							<ui-text .variant=${'overline'} .tone=${'accent'}>overline · uppercase tracker</ui-text>
							<ui-text .variant=${'mono'}>monospace_for_addresses_and_codes</ui-text>
							<ui-text .variant=${'body'} .tone=${'success'}>success</ui-text>
							<ui-text .variant=${'body'} .tone=${'warning'}>warning</ui-text>
							<ui-text .variant=${'body'} .tone=${'danger'}>danger</ui-text>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="typography" ?hidden=${() => {
					return this.demoHidden('typography', 'UIIcon icon');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIIcon</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>sizes · tones · spin</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'lg',
							align: 'center',
							wrap: true,
						}}>
							<ui-icon .state=${{
								name: 'star',
								size: 'xs',
								tone: 'accent',
							}}></ui-icon>
							<ui-icon .state=${{
								name: 'star',
								size: 'sm',
								tone: 'accent',
							}}></ui-icon>
							<ui-icon .state=${{
								name: 'star',
								size: 'md',
								tone: 'accent',
							}}></ui-icon>
							<ui-icon .state=${{
								name: 'star',
								size: 'lg',
								tone: 'accent',
							}}></ui-icon>
							<ui-icon .state=${{
								name: 'star',
								size: 'xl',
								tone: 'accent',
							}}></ui-icon>
							<ui-icon .state=${{
								name: 'circle-check',
								size: 'lg',
								tone: 'success',
							}}></ui-icon>
							<ui-icon .state=${{
								name: 'triangle-alert',
								size: 'lg',
								tone: 'warning',
							}}></ui-icon>
							<ui-icon .state=${{
								name: 'circle-x',
								size: 'lg',
								tone: 'danger',
							}}></ui-icon>
							<ui-icon .state=${{
								name: 'loader-circle',
								size: 'lg',
								spin: this.state.spinDemo,
							}}></ui-icon>
							<ui-button .state=${{
								label: this.state.spinDemo ? 'Stop' : 'Spin',
								tone: 'primary',
								variant: 'outline',
								size: 'sm',
							}} @buttonClick=${this.toggleSpin}></ui-button>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="actions" ?hidden=${() => {
					return this.demoHidden('actions', 'UIButton button action');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIButton</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>tones × variants × sizes · tap snap built in</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'column',
							gap: 'md',
						}}>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'sm',
								wrap: true,
								align: 'center',
							}}>
								<ui-button .state=${{
									label: 'Solid neutral',
								}}></ui-button>
								<ui-button .state=${{
									label: 'Solid primary',
									tone: 'primary',
								}}></ui-button>
								<ui-button .state=${{
									label: 'Solid success',
									tone: 'success',
								}}></ui-button>
								<ui-button .state=${{
									label: 'Solid danger',
									tone: 'danger',
								}}></ui-button>
								<ui-button .state=${{
									label: 'Solid warning',
									tone: 'warning',
								}}></ui-button>
							</ui-stack>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'sm',
								wrap: true,
								align: 'center',
							}}>
								<ui-button .state=${{
									label: 'Outline neutral',
									variant: 'outline',
								}}></ui-button>
								<ui-button .state=${{
									label: 'Outline primary',
									variant: 'outline',
									tone: 'primary',
								}}></ui-button>
								<ui-button .state=${{
									label: 'Outline danger',
									variant: 'outline',
									tone: 'danger',
								}}></ui-button>
							</ui-stack>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'sm',
								wrap: true,
								align: 'center',
							}}>
								<ui-button .state=${{
									label: 'Ghost',
									variant: 'ghost',
								}}></ui-button>
								<ui-button .state=${{
									label: 'Ghost primary',
									variant: 'ghost',
									tone: 'primary',
								}}></ui-button>
								<ui-button .state=${{
									label: 'Link',
									variant: 'link',
									tone: 'primary',
								}}></ui-button>
							</ui-stack>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'sm',
								wrap: true,
								align: 'center',
							}}>
								<ui-button .state=${{
									label: 'XS',
									size: 'xs',
									tone: 'primary',
								}}></ui-button>
								<ui-button .state=${{
									label: 'SM',
									size: 'sm',
									tone: 'primary',
								}}></ui-button>
								<ui-button .state=${{
									label: 'MD',
									size: 'md',
									tone: 'primary',
								}}></ui-button>
								<ui-button .state=${{
									label: 'LG',
									size: 'lg',
									tone: 'primary',
								}}></ui-button>
							</ui-stack>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'sm',
								wrap: true,
								align: 'center',
							}}>
								<ui-button .state=${{
									label: 'Disabled',
									disabled: true,
								}}></ui-button>
								<ui-button .state=${{
									label: 'Loading',
									loading: true,
									tone: 'primary',
								}}></ui-button>
								<ui-button .state=${{
									label: 'With leading',
									tone: 'primary',
									leadicon: 'arrow-left',
								}}></ui-button>
								<ui-button .state=${{
									label: 'With trailing',
									tone: 'primary',
									trailicon: 'arrow-right',
								}}></ui-button>
							</ui-stack>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'sm',
								align: 'center',
							}}>
								<ui-button .state=${{
									label: 'Click me',
									tone: 'primary',
								}} @buttonClick=${this.bumpClick}></ui-button>
								<ui-text .variant=${'caption'} .tone=${'muted'}>clicks: ${this.state.clickCount}</ui-text>
							</ui-stack>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="forms" ?hidden=${() => {
					return this.demoHidden('forms', 'UIInput input form field');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIInput</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>sizes · tones · disabled · readonly</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'column',
							gap: 'md',
						}}>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'md',
								wrap: true,
							}}>
								<ui-input .state=${{
									value: this.state.emailValue,
									type: 'email',
									placeholder: 'sm size · email',
									size: 'sm',
								}} @input=${this.syncEmail}></ui-input>
								<ui-input .state=${{
									value: this.state.emailValue,
									type: 'email',
									placeholder: 'md size (default)',
									size: 'md',
								}} @input=${this.syncEmail}></ui-input>
								<ui-input .state=${{
									value: this.state.emailValue,
									type: 'email',
									placeholder: 'lg size',
									size: 'lg',
								}} @input=${this.syncEmail}></ui-input>
							</ui-stack>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'md',
								wrap: true,
							}}>
								<ui-input .state=${{
									placeholder: 'disabled',
									disabled: true,
								}}></ui-input>
								<ui-input .state=${{
									placeholder: 'readonly',
									value: 'cannot edit',
									readonly: true,
								}}></ui-input>
								<ui-input .state=${{
									placeholder: 'error tone',
									tone: 'error',
								}}></ui-input>
							</ui-stack>
							<ui-text .variant=${'caption'} .tone=${'muted'}>live email value: <ui-text .variant=${'mono'}>${this.state.emailValue || '(empty)'}</ui-text></ui-text>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="forms" ?hidden=${() => {
					return this.demoHidden('forms', 'UIField field label form');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIField</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>labelled wrapper · help · error · required</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'column',
							gap: 'lg',
						}}>
							<ui-field .state=${{
								label: 'Email address',
								help: 'We\'ll never share your email.',
								required: true,
							}}>
								<ui-input .state=${{
									value: this.state.emailValue,
									type: 'email',
									placeholder: 'you@example.com',
								}} @input=${this.syncEmail}></ui-input>
							</ui-field>
							<ui-field .state=${{
								label: 'Search',
								error: 'No results found',
							}}>
								<ui-input .state=${{
									value: this.state.searchValue,
									type: 'search',
									placeholder: 'try anything',
									tone: 'error',
								}} @input=${this.syncSearch}></ui-input>
							</ui-field>
							<ui-field .state=${{
								label: 'Amount',
								help: 'inline layout',
								inline: true,
							}}>
								<ui-input .state=${{
									value: this.state.amountValue,
									type: 'number',
									placeholder: '0.00',
								}} @input=${this.syncAmount}></ui-input>
							</ui-field>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="feedback" ?hidden=${() => {
					return this.demoHidden('feedback', 'UIBadge badge');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIBadge</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>existing · entrance pop + value-change pulse</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'md',
							wrap: true,
							align: 'center',
						}}>
							<ui-badge .state=${{
								label: 'neutral',
							}}></ui-badge>
							<ui-badge .state=${{
								label: 'success',
								tone: 'success',
							}}></ui-badge>
							<ui-badge .state=${{
								label: 'warning',
								tone: 'warning',
							}}></ui-badge>
							<ui-badge .state=${{
								label: 'danger',
								tone: 'danger',
							}}></ui-badge>
							<ui-badge .state=${{
								label: 'info',
								tone: 'info',
							}}></ui-badge>
							<ui-badge .state=${{
								label: 'accent',
								tone: 'accent',
							}}></ui-badge>
							<ui-badge .state=${{
								label: 'small',
								tone: 'success',
								size: 'sm',
							}}></ui-badge>
							<ui-badge .state=${{
								label: 'large',
								tone: 'accent',
								size: 'lg',
							}}></ui-badge>
							<ui-badge .state=${{
								label: 'with dot',
								tone: 'success',
								dot: true,
							}}></ui-badge>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'sm',
								align: 'center',
							}}>
								<ui-badge .state=${{
									label: String(this.state.badgeCount),
									tone: 'accent',
								}}></ui-badge>
								<ui-button .state=${{
									label: 'Bump (test pulse)',
									size: 'sm',
									variant: 'outline',
								}} @buttonClick=${this.bumpBadge}></ui-button>
							</ui-stack>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="feedback" ?hidden=${() => {
					return this.demoHidden('feedback', 'UISpinner spinner loading');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UISpinner</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>sizes · variants · label</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'lg',
							align: 'center',
							wrap: true,
						}}>
							<ui-spinner .state=${{
								size: 'sm',
							}}></ui-spinner>
							<ui-spinner .state=${{
								size: 'md',
							}}></ui-spinner>
							<ui-spinner .state=${{
								size: 'lg',
							}}></ui-spinner>
							<ui-spinner .state=${{
								size: 'xl',
							}}></ui-spinner>
							<ui-spinner .state=${{
								size: 'md',
								variant: 'bars',
							}}></ui-spinner>
							<ui-spinner .state=${{
								size: 'md',
								label: 'Loading…',
							}}></ui-spinner>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="feedback" ?hidden=${() => {
					return this.demoHidden('feedback', 'UISkeleton skeleton placeholder');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UISkeleton</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>text · multi-line · circle · rect</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'lg',
							align: 'center',
							wrap: true,
						}}>
							<ui-skeleton .state=${{
								variant: 'circle',
								width: '48px',
								height: '48px',
							}}></ui-skeleton>
							<ui-skeleton .state=${{
								variant: 'rect',
								width: '120px',
								height: '64px',
								radius: '8px',
							}}></ui-skeleton>
							<ui-skeleton .state=${{
								variant: 'text',
								lines: 4,
								width: '240px',
							}}></ui-skeleton>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="feedback" ?hidden=${() => {
					return this.demoHidden('feedback', 'UILoadingBar loading bar progress');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UILoadingBar</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>determinate · value label · indeterminate</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'column',
							gap: 'md',
						}}>
							<ui-loading-bar .state=${{
								value: 35,
							}}></ui-loading-bar>
							<ui-loading-bar .state=${{
								value: 72,
								showValue: true,
							}}></ui-loading-bar>
							<ui-loading-bar .state=${{
								indeterminate: true,
								label: 'Working',
							}}></ui-loading-bar>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="feedback" ?hidden=${() => {
					return this.demoHidden('feedback', 'UIEmptyState empty placeholder');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIEmptyState</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>title · hint · icon · action</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'lg',
							wrap: true,
						}}>
							<ui-surface .state=${{
								tone: 'subtle',
								padding: 'md',
								radius: 'md',
							}}>
								<ui-empty-state .state=${{
									title: 'No transactions yet',
								}}></ui-empty-state>
							</ui-surface>
							<ui-surface .state=${{
								tone: 'subtle',
								padding: 'md',
								radius: 'md',
							}}>
								<ui-empty-state .state=${{
									icon: '⊘',
									title: 'Wallet is empty',
									hint: 'Fund your wallet to get started.',
									actionLabel: 'Open faucet',
								}}></ui-empty-state>
							</ui-surface>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="data" ?hidden=${() => {
					return this.demoHidden('data', 'UIPanel panel chrome');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIPanel</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>id · title · status dot chrome</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'md',
							wrap: true,
						}}>
							<ui-panel .state=${{
								id: 'WALLET',
								title: 'ADDRESS',
							}}></ui-panel>
							<ui-panel .state=${{
								id: 'NET',
								title: 'STATUS',
								showDot: false,
							}}></ui-panel>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="forms" ?hidden=${() => {
					return this.demoHidden('forms', 'UIThemeSelect theme select popover');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIThemeSelect</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>popover theme switcher</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-theme-select></ui-theme-select>
					</ui-surface>
				</section>

				<section class="demo" data-cat="overlays" ?hidden=${() => {
					return this.demoHidden('overlays', 'UIModal modal dialog');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIModal</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>native dialog · backdrop dismiss</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-button .state=${{
							label: 'Open modal',
							tone: 'primary',
						}} @buttonClick=${this.openModal}></ui-button>
						<ui-modal #modal>
							<ui-surface .state=${{
								tone: 'popup',
								padding: 'lg',
								radius: 'lg',
							}}>
								<ui-stack .state=${{
									direction: 'column',
									gap: 'md',
								}}>
									<ui-text .variant=${'h3'} .tone=${'accent'}>Confirm transfer</ui-text>
									<ui-text .variant=${'body'} .tone=${'muted'}>This sends 12.4 VIAT to the selected address. This action cannot be undone.</ui-text>
									<ui-stack .state=${{
										direction: 'row',
										gap: 'sm',
										justify: 'end',
									}}>
										<ui-button .state=${{
											label: 'Cancel',
											variant: 'ghost',
										}} @buttonClick=${this.closeModal}></ui-button>
										<ui-button .state=${{
											label: 'Confirm',
											tone: 'primary',
										}} @buttonClick=${this.closeModal}></ui-button>
									</ui-stack>
								</ui-stack>
							</ui-surface>
						</ui-modal>
					</ui-surface>
				</section>

				<section class="demo" data-cat="overlays" ?hidden=${() => {
					return this.demoHidden('overlays', 'UIModal controls maximize minimize');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIModal · built-in controls</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>opt-in close / maximize / minimize buttons · controlsSide · afterAction</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'sm',
							wrap: true,
						}}>
							<ui-button .state=${{
								label: 'Windows-style (right)',
								tone: 'primary',
							}} @buttonClick=${this.openControlsModal}></ui-button>
							<ui-button .state=${{
								label: 'macOS-style (left)',
								tone: 'primary',
								variant: 'outline',
							}} @buttonClick=${this.openMacModal}></ui-button>
							<ui-button .state=${{
								label: 'With afterAction callback',
								variant: 'ghost',
							}} @buttonClick=${this.openMaximizedStartModal}></ui-button>
						</ui-stack>
						<ui-modal #controls_modal .state=${{
							showClose: true,
							showMaximize: true,
						}}>
							<ui-surface .state=${{
								tone: 'popup',
								padding: 'lg',
								radius: 'lg',
							}}>
								<ui-stack .state=${{
									direction: 'column',
									gap: 'md',
								}}>
									<ui-text .variant=${'h3'} .tone=${'accent'}>Built-in controls · right</ui-text>
									<ui-text .variant=${'body'} .tone=${'muted'}>Minimize collapses the body to a 240×46 strip; maximize fills the viewport; close dismisses. State resets to default on close.</ui-text>
								</ui-stack>
							</ui-surface>
						</ui-modal>
						<ui-modal #mac_modal .state=${{
							showClose: true,
							showMaximize: true,
							controlsSide: 'left',
						}}>
							<ui-surface .state=${{
								tone: 'popup',
								padding: 'lg',
								radius: 'lg',
							}}>
								<ui-stack .state=${{
									direction: 'column',
									gap: 'md',
								}}>
									<ui-text .variant=${'h3'} .tone=${'accent'}>macOS-style</ui-text>
									<ui-text .variant=${'body'} .tone=${'muted'}>Same buttons, anchored left with close-first ordering done via CSS order (DOM stays unchanged).</ui-text>
								</ui-stack>
							</ui-surface>
						</ui-modal>
						<ui-modal #after_action_modal .state=${{
							showClose: true,
							showMaximize: true,
						}}>
							<ui-surface .state=${{
								tone: 'popup',
								padding: 'lg',
								radius: 'lg',
							}}>
								<ui-stack .state=${{
									direction: 'column',
									gap: 'md',
								}}>
									<ui-text .variant=${'h3'} .tone=${'accent'}>afterAction</ui-text>
									<ui-text .variant=${'body'} .tone=${'muted'}>When you close this modal the registered callback fires with the close returnValue. Watch the confirm-behavior section below.</ui-text>
								</ui-stack>
							</ui-surface>
						</ui-modal>
					</ui-surface>
				</section>

				<section class="demo" data-cat="actions" ?hidden=${() => {
					return this.demoHidden('actions', 'UICloseButton close button');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UICloseButton</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>rotate-on-hover × · same animation used by the built-in modal close</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'md',
							align: 'center',
						}}>
							<ui-close-button></ui-close-button>
							<ui-text .variant=${'caption'} .tone=${'muted'}>hover → rotate(90deg); active → rotate(180deg)</ui-text>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="layout" ?hidden=${() => {
					return this.demoHidden('layout', 'UITabs tabs navigation');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UITabs</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>animated tab strip · cross-fade content swap · vertical & horizontal</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'column',
							gap: 'lg',
						}}>
							<ui-tabs .tabs=${[
								{
									id: 'overview',
									label: 'Overview',
								},
								{
									id: 'security',
									label: 'Security',
								},
								{
									id: 'advanced',
									label: 'Advanced',
								},
							]}>
								<ui-surface slot="overview" .state=${{
									tone: 'subtle',
									padding: 'md',
									radius: 'md',
								}}>
									<ui-text .variant=${'body'}>Horizontal tabs · overview panel.</ui-text>
								</ui-surface>
								<ui-surface slot="security" .state=${{
									tone: 'subtle',
									padding: 'md',
									radius: 'md',
								}}>
									<ui-text .variant=${'body'}>Security panel content.</ui-text>
								</ui-surface>
								<ui-surface slot="advanced" .state=${{
									tone: 'subtle',
									padding: 'md',
									radius: 'md',
								}}>
									<ui-text .variant=${'body'}>Advanced panel content.</ui-text>
								</ui-surface>
							</ui-tabs>
							<ui-tabs .orientation=${'vertical'} .tabs=${[
								{
									id: 'profile',
									label: 'Profile',
								},
								{
									id: 'wallet',
									label: 'Wallet',
								},
								{
									id: 'theme',
									label: 'Theme',
								},
							]}>
								<ui-surface slot="profile" .state=${{
									tone: 'subtle',
									padding: 'md',
									radius: 'md',
								}}>
									<ui-text .variant=${'body'}>Vertical tabs · profile panel.</ui-text>
								</ui-surface>
								<ui-surface slot="wallet" .state=${{
									tone: 'subtle',
									padding: 'md',
									radius: 'md',
								}}>
									<ui-text .variant=${'body'}>Wallet panel.</ui-text>
								</ui-surface>
								<ui-surface slot="theme" .state=${{
									tone: 'subtle',
									padding: 'md',
									radius: 'md',
								}}>
									<ui-text .variant=${'body'}>Theme panel.</ui-text>
								</ui-surface>
							</ui-tabs>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="overlays" ?hidden=${() => {
					return this.demoHidden('overlays', 'confirm dialog promise');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>this.confirm()</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>imperative this.confirm(message) · ui-modal backed · returns Promise&lt;boolean&gt;</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'sm',
							wrap: true,
							align: 'center',
						}}>
							<ui-button .state=${{
								label: 'Delete wallet',
								tone: 'danger',
							}} @click=${this.doDestructiveAction}></ui-button>
							<ui-text .variant=${'caption'} .tone=${'muted'}>last result: ${this.state.confirmResult}</ui-text>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="overlays" ?hidden=${() => {
					return this.demoHidden('overlays', 'UINotification notification toast');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UINotification</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>stacked toasts · default · error</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'sm',
							wrap: true,
							align: 'center',
						}}>
							<ui-button .state=${{
								label: 'Push notification',
								tone: 'primary',
							}} @buttonClick=${this.notifyDefault}></ui-button>
							<ui-button .state=${{
								label: 'Push error',
								tone: 'danger',
							}} @buttonClick=${this.notifyError}></ui-button>
						</ui-stack>
						<ui-notification #notify></ui-notification>
					</ui-surface>
				</section>

				<section class="demo" data-cat="overlays" ?hidden=${() => {
					return this.demoHidden('overlays', 'UILoadingScreen loading overlay');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UILoadingScreen</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>blocking overlay · auto-closes after 2s</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-button .state=${{
							label: 'Show loading screen',
							tone: 'primary',
						}} @buttonClick=${this.showLoadingScreen}></ui-button>
						<ui-loading-screen #loading></ui-loading-screen>
					</ui-surface>
				</section>

				<section class="demo" data-cat="overlays" ?hidden=${() => {
					return this.demoHidden('overlays', 'BootScreen boot splash');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>BootScreen</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>full-screen splash · auto-dismisses after 2s</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-button .state=${{
							label: 'Show boot screen',
							tone: 'primary',
						}} @buttonClick=${this.showBootScreen}></ui-button>
					</ui-surface>
				</section>

				<section class="demo" data-cat="forms" ?hidden=${() => {
					return this.demoHidden('forms', 'UISelect select dropdown picker');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UISelect</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>styled native picker · options · disabled option · change event</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'lg',
							align: 'center',
							wrap: true,
						}}>
							<ui-select .state=${{
								value: this.state.selectValue,
								options: this.state.selectOptions,
							}} @change=${this.syncSelect}></ui-select>
							<ui-text .variant=${'caption'} .tone=${'muted'}>selected: <ui-text .variant=${'mono'}>${this.state.selectValue}</ui-text></ui-text>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="actions" ?hidden=${() => {
					return this.demoHidden('actions', 'UIIconButton icon button');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIIconButton</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>icon-only button · tooltip · sizes · active state · tap snap</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'md',
							align: 'center',
							wrap: true,
						}}>
							<ui-icon-button .state=${{
								icon: 'sun',
								tooltip: 'Light',
								size: 'sm',
							}}></ui-icon-button>
							<ui-icon-button .state=${{
								icon: 'moon',
								tooltip: 'Dark',
								size: 'md',
							}}></ui-icon-button>
							<ui-icon-button .state=${{
								icon: 'bell',
								tooltip: 'Alerts',
								size: 'lg',
							}}></ui-icon-button>
							<ui-icon-button .state=${{
								icon: 'star',
								tooltip: 'Active',
								size: 'md',
								active: true,
							}}></ui-icon-button>
							<ui-icon-button .state=${{
								icon: 'settings',
								tooltip: 'Spin on hover',
								size: 'md',
								animate: 'compass',
							}}></ui-icon-button>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="forms" ?hidden=${() => {
					return this.demoHidden('forms', 'UIToolbar toolbar actions');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIToolbar</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>ui-bar + icon-button action row · tooltips</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-toolbar .state=${{
							actions: this.state.toolbarActions,
						}}></ui-toolbar>
					</ui-surface>
				</section>

				<section class="demo" data-cat="layout" ?hidden=${() => {
					return this.demoHidden('layout', 'UIBar bar regions start center end');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIBar</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>three-region layout primitive · start / center / end slots</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-bar class="demo-bar">
							<ui-text slot="start" .variant=${'mono'} .tone=${'accent'}>⩝ START</ui-text>
							<ui-text slot="center" .variant=${'caption'} .tone=${'muted'}>center region</ui-text>
							<ui-badge slot="end" .state=${{
								label: 'END',
								tone: 'accent',
							}}></ui-badge>
						</ui-bar>
					</ui-surface>
				</section>

				<section class="demo" data-cat="feedback" ?hidden=${() => {
					return this.demoHidden('feedback', 'UIStatusIndicator status online offline');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIStatusIndicator</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>online · connecting · offline · reactive .status= binding</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'lg',
							align: 'center',
							wrap: true,
						}}>
							<ui-status-indicator .status=${'online'}></ui-status-indicator>
							<ui-status-indicator .status=${'connecting'}></ui-status-indicator>
							<ui-status-indicator .status=${'offline'}></ui-status-indicator>
							<ui-stack .state=${{
								direction: 'row',
								gap: 'sm',
								align: 'center',
							}}>
								<ui-status-indicator .status=${this.state.statusValue}></ui-status-indicator>
								<ui-button .state=${{
									label: 'Cycle',
									size: 'sm',
									variant: 'outline',
								}} @buttonClick=${this.cycleStatus}></ui-button>
							</ui-stack>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="data" ?hidden=${() => {
					return this.demoHidden('data', 'UIStatTable stat table data grid');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIStatTable</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>columns · rows · grid-template widths · title + hint</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stat-table .state=${{
							title: 'NETWORK',
							hint: 'live · 24h delta',
							columns: this.state.statTableColumns,
							rows: this.state.statTableRows,
						}}></ui-stat-table>
					</ui-surface>
				</section>

				<section class="demo" data-cat="data" ?hidden=${() => {
					return this.demoHidden('data', 'UIPagedList paged list load more');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>PagedList</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>load-more pager · synthetic loader (3 pages × 8 rows) · head row</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<paged-list class="demo-paged" .state=${this.listConfig}></paged-list>
					</ui-surface>
				</section>

				<section class="demo" data-cat="overlays" ?hidden=${() => {
					return this.demoHidden('overlays', 'UIWhiteboxModal whitebox lightbox image');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIWhiteboxModal</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>media lightbox · image / video · caption · maximize</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-button .state=${{
							label: 'Open lightbox',
							tone: 'primary',
							leadicon: 'image',
						}} @buttonClick=${this.openWhitebox}></ui-button>
						<ui-whitebox-modal #whitebox .state=${{
							src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="%230A1128"/><text x="320" y="190" font-family="monospace" font-size="40" fill="%2300F0FF" text-anchor="middle">⩝ VIAT</text></svg>',
							alt: 'VIAT placeholder',
							caption: 'A synthetic SVG frame — swap src for any image or video URL.',
						}}></ui-whitebox-modal>
					</ui-surface>
				</section>

				<section class="demo" data-cat="shell" ?hidden=${() => {
					return this.demoHidden('shell', 'UIDock dock navigation rail');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIDock</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>icon rail · active bar · horizontal & vertical orientation</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'panel',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-stack .state=${{
							direction: 'row',
							gap: 'xl',
							align: 'center',
							wrap: true,
						}}>
							<ui-dock .state=${{
								items: this.state.dockItems,
								activeId: this.state.dockActiveId,
								orientation: 'vertical',
								showActiveBar: true,
							}}></ui-dock>
							<ui-dock .state=${{
								items: this.state.dockItems,
								activeId: this.state.dockActiveId,
								orientation: 'horizontal',
								showActiveBar: true,
							}}></ui-dock>
						</ui-stack>
					</ui-surface>
				</section>

				<section class="demo" data-cat="shell" ?hidden=${() => {
					return this.demoHidden('shell', 'UIAppBar app bar top masthead');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIAppBar</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>fixed top masthead · action cluster · framed via contain</ui-text>
					</div>
					<div class="shell-frame shell-frame-bar">
						<ui-app-bar .state=${{
							actions: this.state.appBarActions,
						}}>
							<ui-text slot="brand" .variant=${'mono'} .tone=${'accent'}>⩝ VIAT</ui-text>
						</ui-app-bar>
					</div>
				</section>

				<section class="demo" data-cat="shell" ?hidden=${() => {
					return this.demoHidden('shell', 'UIStatusBar status bar bottom cells');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UIStatusBar</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>fixed bottom bar · info cells · dividers · framed via contain</ui-text>
					</div>
					<div class="shell-frame shell-frame-bar">
						<ui-status-bar .state=${{
							cells: this.state.statusCells,
							dividers: true,
						}}></ui-status-bar>
					</div>
				</section>

				<section class="demo" data-cat="shell" ?hidden=${() => {
					return this.demoHidden('shell', 'UISidebar UIPulldown drawer overlay');
				}}>
					<div class="preview-section-head">
						<ui-text .variant=${'overline'} .tone=${'accent'}>UISidebar · UIPulldown</ui-text>
						<ui-text .variant=${'caption'} .tone=${'muted'}>open-on-interaction drawer + overlay · composed at the app shell root</ui-text>
					</div>
					<ui-surface .state=${{
						tone: 'subtle',
						padding: 'lg',
						radius: 'lg',
						border: true,
					}}>
						<ui-empty-state .state=${{
							icon: '⛶',
							title: 'Live-shell components',
							hint: 'Sidebar (swipe drawer) and Pulldown (agent overlay) open on interaction and bind to the app shell. Run the main terminal to exercise them.',
						}}></ui-empty-state>
					</ui-surface>
				</section>

				</main>
			</div>
		`;
	}
}
customElements.define('preview-view', PreviewView);
export default PreviewView;
