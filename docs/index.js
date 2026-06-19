import './modules/registerRoots.js';
import { WebComponent } from 'webcomponent';
import { template } from './template.js';

function escapeHtml(str) {
	return String(str).replace(/[&<>"']/g, (char) => {
		const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
		return map[char];
	});
}

export class SignatureCreator extends WebComponent {
	static id = 'signature-creator';
	static url = import.meta.url;
	static styles = {
		creator: WebComponent.styleSheet(`
			:host {
				display: block;
				min-height: 100dvh;
				background: var(--bg-body, #07080c);
				color: var(--text-main, #e8eaf2);
			}
			.wrap {
				max-width: 960px;
				margin: 0 auto;
				padding: 2rem 1.25rem 3rem;
			}
			.head {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				margin-bottom: 1.5rem;
			}
			.brand {
				font-size: 0.875rem;
				letter-spacing: 0.2em;
				text-transform: uppercase;
				color: var(--text-muted, #6971a0);
			}
			.title {
				font-size: 1.5rem;
				font-weight: 600;
				letter-spacing: -0.01em;
			}
			.panel {
				background: var(--bg-panel, #0c0d12);
				border: 1px solid var(--border-light-color, rgba(255,255,255,0.1));
				border-radius: 0.75rem;
				padding: 1.25rem;
			}
			.section {
				margin-top: 1.5rem;
			}
			.section-head {
				font-size: 0.75rem;
				letter-spacing: 0.12em;
				text-transform: uppercase;
				color: var(--text-muted, #6971a0);
				margin-bottom: 0.5rem;
			}
			.preview-box {
				background: #ffffff;
				border-radius: 0.75rem;
				padding: 1.5rem 1rem;
				display: flex;
				justify-content: center;
				align-items: flex-start;
				min-height: 14rem;
				box-shadow: 0 0.25rem 1rem rgba(0,0,0,0.15);
				overflow: auto;
			}
			textarea.code {
				width: 100%;
				min-height: 14rem;
				font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
				font-size: 0.75rem;
				line-height: 1.45;
				padding: 1rem;
				border-radius: 0.5rem;
				background: var(--bg-dark, #050608);
				color: var(--text-offwhite, #adb4cc);
				border: 1px solid var(--border-light-color, rgba(255,255,255,0.1));
				resize: vertical;
				white-space: pre;
			}
			.actions {
				display: flex;
				gap: 0.75rem;
				flex-wrap: wrap;
				margin-top: 1rem;
			}
			.hint {
				font-size: 0.75rem;
				color: var(--text-muted, #6971a0);
				margin-top: 0.5rem;
			}
			.brand,
			.section-head,
			.hint {
				color: color-mix(in oklab, var(--text-main, #e8eaf2) 82%, var(--text-muted, #6971a0));
			}
			/* inputs inherit framework + theme */
		`),
	};

	static state = {
		name: 'First Last',
		position: 'Work Title',
		cell: '(800) 779-0332',
		code: '',
		copied: false,
	};

	static async create(state, config) {
		const inst = new this(await state, config);
		await WebComponent.preRender(inst, document.body);
		return inst;
	}

	onConnect() {
		this.generate();
	}

	updateField(field, domEvent) {
		const value = domEvent?.detail?.data?.value ?? domEvent?.target?.value ?? '';
		this.state[field] = value;
		this.generate();
	}

	updateName(domEvent) {
		this.updateField('name', domEvent);
	}

	updatePosition(domEvent) {
		this.updateField('position', domEvent);
	}

	updateCell(domEvent) {
		this.updateField('cell', domEvent);
	}

	generate() {
		const html = this.buildSignatureHtml();
		this.state.code = html;
	}

	buildSignatureHtml() {
		const personName = escapeHtml((this.state.name || '').trim() || 'Your Name');
		const personTitle = escapeHtml((this.state.position || '').trim() || 'Your Position');
		const personCell = escapeHtml((this.state.cell || '').trim() || '(800) 779-0332');
		return template(personName, personTitle, personCell);
	}

	async copyCode() {
		const text = this.state.code;
		if (!text) {
			return;
		}
		const ok = await this.copyText(text);
		if (ok) {
			this.state.copied = true;
			this.setTimeout(() => { this.clearCopied(); }, 1600);
		}
	}

	clearCopied() {
		this.state.copied = false;
	}

	selectCode() {
		const ta = this.refs.code;
		if (ta) {
			ta.focus();
			ta.select();
		}
	}

	updatePreviewBox() {
		const box = this.refs.preview;
		if (box) {
			box.innerHTML = this.buildSignatureHtml();
		}
	}

	render() {
		const fullName = this.state.name;
		const workPosition = this.state.position;
		const cellPhone = this.state.cell;
		const code = this.state.code;
		const copiedLabel = this.state.copied ? 'Copied!' : 'Copy Signature Code';

		this.html`
			<div class="wrap">
				<div class="head">
					<span class="brand">TEMPLAR TITAN</span>
					<span class="title">Signature Creator</span>
				</div>

				<div class="panel">
					<div class="section-head">Your details</div>
					<ui-stack .state=${{ direction: 'column', gap: 'md' }}>
						<ui-field .state=${{ label: 'Full name', help: 'Appears uppercase in signature' }}>
							<ui-input
								.state=${{ value: fullName, placeholder: 'Thomas Marchi', size: 'md' }}
								@input=${this.updateName}
							></ui-input>
						</ui-field>

						<ui-field .state=${{ label: 'Work position', help: 'Displayed below name' }}>
							<ui-input
								.state=${{ value: workPosition, placeholder: 'Chief Technology Officer', size: 'md' }}
								@input=${this.updatePosition}
							></ui-input>
						</ui-field>

						<ui-field .state=${{ label: 'Cell phone', help: 'Used for the tel: link and displayed in signature' }}>
							<ui-input
								.state=${{ value: cellPhone, placeholder: '(800) 779-0332', size: 'md', type: 'text' }}
								@input=${this.updateCell}
							></ui-input>
						</ui-field>
					</ui-stack>

					<div class="actions">
						<ui-button
							.state=${{ label: copiedLabel, tone: 'primary', size: 'md', disabled: !code }}
							@buttonClick=${this.copyCode}
						></ui-button>
						<ui-button
							.state=${{ label: 'Select', variant: 'outline', size: 'md', disabled: !code }}
							?hidden=${true}
							@buttonClick=${this.selectCode}
						></ui-button>
					</div>
					<div class="hint">Edit fields above — code and preview update live on every keystroke. Click Copy.</div>
				</div>

				<div class="section">
					<div class="section-head">Live preview</div>
					<div class="panel" style="background:transparent;border:none;padding:0;">
						<div #preview class="preview-box" aria-label="Signature preview"></div>
					</div>
				</div>

				<div class="section">
					<div class="section-head">Signature HTML (copy into your email client)</div>
					<div class="panel">
						<textarea
							#code
							class="code"
							readonly
							.value=${code}
							@click=${this.selectCode}
							aria-label="Generated signature HTML code"
						></textarea>
						<div class="hint">Click the textarea to select all. Use the Copy button for clipboard.</div>
					</div>
				</div>
			</div>
		`;

		this.updatePreviewBox();
	}
}

customElements.define('signature-creator', SignatureCreator);
