export function template(personName, personTitle, personCell) {
	return `<table
	role="presentation"
	border="0"
	cellspacing="0"
	cellpadding="0"
	style="
		border-collapse: separate;
		border-spacing: 0;
		border: 1px solid #d5d9e0;
		border-radius: 1.375rem;
		width: auto;
		max-width: 560px;
		background-color: #ffffff;
		background-image:
			radial-gradient(
				60% 90% at 14% 18%,
				rgba(225, 57, 74, 0.06) 0%,
				rgba(225, 57, 74, 0) 60%
			),
			radial-gradient(
				70% 120% at 92% 108%,
				rgba(47, 95, 208, 0.06) 0%,
				rgba(47, 95, 208, 0) 58%
			);
		box-shadow: 0 0.625rem 1.75rem rgba(16, 24, 40, 0.1);
		padding: 0.125rem 1.375rem 0.125rem 1.125rem;
	"
>
	<tbody>
		<tr>
			<td
				align="center"
				valign="middle"
				style="border: none; padding: 1rem 0.5rem 1rem 1rem"
			>
				<img
					src="https://templartitan.com/wp-content/uploads/2026/06/logo_small.png"
					alt="Templar Titan"
					width="80"
					style="
						display: block;
						width: 6rem;
						max-width: 100%;
						height: auto;
					"
				/>
			</td>
			<td valign="middle" style="border: none; padding: 0; width: 2px">
				<div
					style="
						width: 2px;
						height: 8.5rem;
						border-radius: 2px;
						background: linear-gradient(
							180deg,
							rgba(225, 57, 74, 0) 0%,
							#e1394a 26%,
							#9aa3b2 52%,
							#2f5fd0 76%,
							rgba(47, 95, 208, 0) 100%
						);
						opacity: 0.85;
					"
				>
					&nbsp;
				</div>
			</td>
			<td
				valign="middle"
				style="border: none; padding: 1rem 0 0.8rem 1.2rem"
			>
				<div
					style="
						font-family:
							'Helvetica Neue', 'Segoe UI', Arial, sans-serif;
						font-size: 14px;
						font-size: 0.8875rem;
						font-size: clamp(
							0.925rem,
							0.925rem + 0.55vw,
							0.9875rem
						);
						font-weight: bold;
						letter-spacing: 0.11em;
						text-transform: uppercase;
						color: #1c1b1c;
						margin: 0 0 0.125rem 0px;
						text-wrap: balance;
					"
				>
					${personName}
				</div>
				<div
					style="
						font-family:
							'Helvetica Neue', Helvetica, Arial, sans-serif;
						font-size: 12px;
						font-size: 0.7275rem;
						font-size: clamp(
							0.725rem,
							0.625rem + 0.55vw,
							0.7875rem
						);
						font-weight: 600;
						letter-spacing: 0.22em;
						text-transform: uppercase;
						color: #c8102e;
						margin: 0 0 0.6125rem 1px;
						text-wrap: balance;
					"
				>
					${personTitle}
				</div>
				<table
					role="presentation"
					border="0"
					cellspacing="0"
					cellpadding="0"
					style="border: none; border-collapse: collapse"
				>
					<tbody>
						<tr>
							<td
								style="
									border: none;
									padding: 0.3125rem 0;
									font-family:
										'Helvetica Neue', Helvetica, Arial,
										sans-serif;
									font-size: 13px;
									font-size: 0.8125rem;
									font-size: clamp(
										0.72rem,
										0.6rem + 0.6vw,
										0.8125rem
									);
									line-height: 1.2;
								"
							>
								<a
									href="tel:+18007790332"
									style="
										color: #475467;
										text-decoration: none;
										letter-spacing: 0.02em;
										word-break: break-word;
										overflow-wrap: anywhere;
									"
									><span
										style="vertical-align: middle"
										>(800) 779-0332</span
									></a
								>
							</td>
						</tr>
						<tr>
							<td
								style="
									border: none;
									padding: 0.3125rem 0;
									font-family:
										'Helvetica Neue', Helvetica, Arial,
										sans-serif;
									font-size: 13px;
									font-size: 0.8125rem;
									font-size: clamp(
										0.72rem,
										0.6rem + 0.6vw,
										0.8125rem
									);
									line-height: 1.6;
								"
							>
								<a
									href="tel:${personCell}"
									style="
										color: #475467;
										text-decoration: none;
										letter-spacing: 0.02em;
										word-break: break-word;
										overflow-wrap: anywhere;
									"
									><span
										style="
											vertical-align: middle;
											text-transform: uppercase;
										"
										>${personCell}</span
									></a
								>
							</td>
						</tr>
						<tr>
							<td
								style="
									border: none;
									padding: 0.3125rem 0;
									font-family:
										'Helvetica Neue', Helvetica, Arial,
										sans-serif;
									font-size: 13px;
									font-size: 0.8125rem;
									font-size: clamp(
										0.72rem,
										0.6rem + 0.6vw,
										0.8125rem
									);
									line-height: 1.2;
								"
							>
								<a
									href="https://templartitan.com"
									style="
										color: #124acd;
										text-decoration: underline;
										font-weight: bold;
										letter-spacing: 0.15em;
										word-break: break-word;
										overflow-wrap: anywhere;
										font-family:
											Georgia, 'Times New Roman', serif;
											text-underline-offset: 2px;
									"
									target="_blank"
									><span
										style="
											vertical-align: middle;
											text-transform: uppercase;
										"
										>templartitan.com</span
									></a
								>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
		<tr>
			<td
				colspan="3"
				align="center"
				style="
					border: none;
					border-top: 1px solid #edeef1;
					padding: 0.95rem 1.25rem 0.95rem 1.25rem;
					font-family: Georgia, 'Times New Roman', serif;
					font-style: italic;
					font-size: 12px;
					font-size: 1em;
					font-size: clamp(1em, 0.8rem + 0.5vw, 1em);
					color: #161b21;
					letter-spacing: 0.01em;
					line-height: 1.35;
					text-wrap: balance;
					text-transform: capitalize;
					text-align: center;
				"
			>
				<span
					style="
						font-family: Georgia, 'Times New Roman', serif;
						font-style: normal;
						font-size: 1.45em;
						line-height: 0;
						color: #b9c0cc;
						vertical-align: -0.28em;
						margin-right: 0.06em;
					"
					>&#8220;</span
				>Providing Timely Solutions to Complex Scenarios<span
					style="
						font-family: Georgia, 'Times New Roman', serif;
						font-style: normal;
						font-size: 1.45em;
						line-height: 0;
						color: #b9c0cc;
						vertical-align: -0.28em;
						margin-right: 0.06em;
					"
					>&#8221;</span
				>
			</td>
		</tr>
	</tbody>
</table>
<br /><br />`;
}