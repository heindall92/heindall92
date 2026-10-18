#!/usr/bin/env node
/* Genera los gráficos del perfil de GitHub de heindall92 en tema claro y oscuro.
 *
 * Lenguaje común de las herramientas del autor: fondo casi negro frío o gris perla, un único acento (azul eléctrico),
 * Geist y Geist Mono, iconos Lucide (ISC, en lucide-icons.json) y movimiento sin rebote que se apaga con
 * prefers-reduced-motion. Sin servicios externos: todo sale de este script.
 *
 * Uso: node scripts/generar.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets');
const ICONS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/lucide-icons.json'), 'utf8'));
const font = (f) => fs.readFileSync(path.join(OUT, 'fonts', f)).toString('base64');
const GEIST = font('geist-latin.woff2');
const GEIST_MONO = font('geist-mono-latin.woff2');

/* Tokens (los mismos que Rosetta y CTEM-Nexus) */
const THEMES = {
  dark: { bg: '#08090b', s1: '#111317', s2: '#171a1f', s3: '#1e2228', line: 'rgba(255,255,255,.08)', line2: 'rgba(255,255,255,.13)',
    ink: '#eef1f3', ink2: '#a3aab2', ink3: '#8f97a0', ink4: '#646c75', acc: '#6b9bff', accS: '#9dbdff', accT: 'rgba(107,155,255,.14)', ok: '#4cd08a', warn: '#ff9f43', crit: '#ff5d5d' },
  light: { bg: '#f3f5f7', s1: '#ffffff', s2: '#eef1f4', s3: '#e2e6eb', line: 'rgba(16,20,24,.08)', line2: 'rgba(16,20,24,.14)',
    ink: '#101418', ink2: '#2c3440', ink3: '#5c6773', ink4: '#9aa3ad', acc: '#1a4fe0', accS: '#123db8', accT: 'rgba(26,79,224,.10)', ok: '#16794a', warn: '#9c3d08', crit: '#a8234a' },
};
const SANS = "'Geist', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif";
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Icono Lucide en (x, y) con tamaño s */
function icon(name, x, y, s, color, sw = 2) {
  const node = ICONS[name];
  if (!node) throw new Error(`Falta el icono ${name}`);
  const body = node.map(([tag, a]) => `<${tag} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s / 24})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
}

/* Hoja de estilo común: fuentes incrustadas solo donde hacen falta, entrada con muelle sin rebote y movimiento reducido */
function style(t, { fonts = false, extra = '' } = {}) {
  return `<style>
${fonts ? `@font-face{font-family:'Geist';src:url(data:font/woff2;base64,${GEIST}) format('woff2');font-weight:100 900}
@font-face{font-family:'Geist Mono';src:url(data:font/woff2;base64,${GEIST_MONO}) format('woff2');font-weight:100 900}` : ''}
text{font-family:${SANS};fill:${t.ink}}
.mono{font-family:${MONO}}
/* Visible por defecto: si el visor no anima el SVG, el contenido se ve igual */
.in{animation:in .9s cubic-bezier(.32,.72,0,1) both}
@keyframes in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.d1{animation-delay:.08s}.d2{animation-delay:.16s}.d3{animation-delay:.24s}.d4{animation-delay:.32s}.d5{animation-delay:.4s}.d6{animation-delay:.48s}.d7{animation-delay:.56s}
.flow{stroke-dasharray:4 7;animation:flow 1.6s linear infinite}
@keyframes flow{to{stroke-dashoffset:-22}}
${extra}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;
}
const svg = (w, h, label, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${body}</svg>\n`;
const write = (name, theme, content) => fs.writeFileSync(path.join(OUT, `${name}-${theme}.svg`), content);

/* ───────── Cabecera ───────── */
function hero(th) {
  const t = THEMES[th];
  const W = 1200, H = 440;
  const off = [['Nmap', 92], ['BloodHound', 160], ['Burp Suite', 228], ['PingCastle', 296]];
  const grc = [['ENS', 92], ['ISO/IEC 27001', 160], ['NIS2 · DORA', 228], ['LATAM', 296]];
  const lx = 742, rx = 1048, cx = 895, cy = 194;
  const chip = (x, y, label, anchor, d) => {
    const w = label.length * 7.6 + 26; const x0 = anchor === 'end' ? x - w : x;
    return `<g class="in ${d}"><rect x="${x0}" y="${y - 15}" width="${w}" height="30" rx="15" fill="${t.s2}" stroke="${t.line2}"/><text x="${x0 + w / 2}" y="${y + 5}" font-size="13" font-weight="500" text-anchor="middle" fill="${t.ink2}">${esc(label)}</text></g>`;
  };
  const links = [...off.map(([, y]) => `M${lx + 4} ${y} C ${lx + 70} ${y}, ${cx - 80} ${cy}, ${cx - 44} ${cy}`), ...grc.map(([, y]) => `M${cx + 44} ${cy} C ${cx + 80} ${cy}, ${rx - 70} ${y}, ${rx - 4} ${y}`)];
  const body = `${style(t, { fonts: true })}
<rect width="${W}" height="${H}" rx="28" fill="${t.bg}"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="27.5" fill="none" stroke="${t.line}"/>
<g class="in"><text x="64" y="86" class="mono" font-size="14" letter-spacing=".08em" fill="${t.ink3}">HEINDALL92 · HUELVA, ESPAÑA</text></g>
<g class="in d1"><text x="62" y="160" font-size="58" font-weight="650" letter-spacing="-.03em">Yoandy Ramírez</text>
<text x="62" y="222" font-size="58" font-weight="650" letter-spacing="-.03em">Delgado</text></g>
<g class="in d2"><text x="64" y="268" font-size="18" font-weight="600" fill="${t.ink}">Pentester · AI Security y agentes de IA</text>
<text x="64" y="294" font-size="15" font-weight="500" fill="${t.ink2}">Active Directory · Web · DFIR · ENS · NIS2 · ISO 27001 · ISO 42001 · eJPTv2</text></g>
<g class="in d3"><text x="64" y="340" font-size="16.5" fill="${t.ink3}">Rompo sistemas con permiso y construyo, en abierto y en español,</text>
<text x="64" y="364" font-size="16.5" fill="${t.ink3}">las herramientas GRC que convierten lo encontrado en cumplimiento.</text></g>
<g class="in d4">${icon('map-pin', 64, 390, 16, t.acc)}<text x="88" y="403" font-size="14" fill="${t.ink3}">Híbrido en Huelva y Madrid · remoto en España y la UE</text></g>
<line x1="${lx - 128}" y1="56" x2="${lx - 128}" y2="${H - 56}" stroke="${t.line}"/>
<text x="${lx - 92}" y="56" class="mono" font-size="11" letter-spacing=".08em" fill="${t.ink3}">OFENSIVO</text>
<text x="${rx + 92}" y="56" class="mono" font-size="11" letter-spacing=".08em" fill="${t.ink3}" text-anchor="end">GRC</text>
${links.map((d) => `<path d="${d}" fill="none" stroke="${t.line2}" stroke-width="1.5"/><path d="${d}" fill="none" stroke="${t.acc}" stroke-width="1.5" class="flow" opacity=".75"/>`).join('')}
${off.map(([l, y], i) => chip(lx, y, l, 'end', `d${i + 2}`)).join('')}
${grc.map(([l, y], i) => chip(rx, y, l, 'start', `d${i + 2}`)).join('')}
<g class="in d3"><circle cx="${cx}" cy="${cy}" r="44" fill="${t.accT}" stroke="${t.acc}" stroke-width="1.5"/>${icon('arrow-left-right', cx - 14, cy - 14, 28, t.acc)}</g>
<g class="in d5"><text x="${cx}" y="${cy + 74}" font-size="13" font-weight="600" text-anchor="middle" fill="${t.ink}">El puente</text>
<text x="${cx}" y="${cy + 94}" font-size="12.5" text-anchor="middle" fill="${t.ink3}">del hallazgo técnico al control</text></g>
<g class="in d6"><rect x="${lx - 92}" y="${H - 84}" width="${rx - lx + 184}" height="40" rx="12" fill="${t.s1}" stroke="${t.line}"/>
${icon('blocks', lx - 76, H - 74, 20, t.acc)}<text x="${lx - 48}" y="${H - 59}" font-size="13.5" fill="${t.ink2}"><tspan font-weight="600" fill="${t.ink}">8 herramientas, un formato:</tspan> yrd-ecosistema</text></g>`;
  return svg(W, H, 'Yoandy Ramírez Delgado · Pentester · AI Security y agentes de IA · Active Directory · Web · DFIR · ENS · NIS2 · ISO 27001 · ISO 42001 · eJPTv2. Puente entre lo ofensivo y el GRC.', body);
}

/* ───────── Cifras ───────── */
function stats(th) {
  const t = THEMES[th];
  const W = 1200, H = 150;
  const items = [['8', 'herramientas GRC abiertas'], ['15', 'normas y leyes en Rosetta'], ['152', 'controles unificados'], ['89', 'máquinas en Hack The Box'], ['0', 'peticiones a terceros']];
  const cw = W / items.length;
  const body = `${style(t, { fonts: true })}
<rect width="${W}" height="${H}" rx="24" fill="${t.s1}" stroke="${t.line}"/>
${items.map(([n, l], i) => `<g class="in d${i + 1}">${i ? `<line x1="${i * cw}" y1="36" x2="${i * cw}" y2="${H - 36}" stroke="${t.line}"/>` : ''}
<text x="${i * cw + cw / 2}" y="80" font-size="46" font-weight="650" letter-spacing="-.03em" text-anchor="middle" style="font-variant-numeric:tabular-nums">${n}</text>
<text x="${i * cw + cw / 2}" y="110" font-size="14" text-anchor="middle" fill="${t.ink3}">${l}</text></g>`).join('')}`;
  return svg(W, H, items.map(([n, l]) => `${n} ${l}`).join(' · '), body);
}

/* ───────── Ecosistema: quién envía qué a quién ───────── */
function ecosistema(th) {
  const t = THEMES[th];
  const W = 1200, H = 560, cx = 600, cy = 290;
  const nodes = [
    { id: 'kairos', name: 'KAIROS', sub: 'Continuidad', ic: 'hourglass', x: 170, y: 104, edge: 'bia →', back: '← activos' },
    { id: 'studio', name: 'Compliance Studio', sub: 'ENS', ic: 'shield-check', x: 170, y: 222, edge: 'soa →' },
    { id: 'ad', name: 'ENS AD Auditor', sub: 'Directorio activo', ic: 'key-round', x: 170, y: 340, edge: 'hallazgos →' },
    { id: 'mcp', name: 'MCP-Shield', sub: 'Asistentes de IA', ic: 'bot', x: 170, y: 458, edge: 'hallazgos →' },
    { id: 'rosetta', name: 'Rosetta', sub: '15 normas y leyes', ic: 'languages', x: 1030, y: 120, edge: 'hallazgos →', back: '← controles' },
    { id: 'norvik', name: 'Norvik', sub: 'Gobernanza', ic: 'landmark', x: 1030, y: 290, edge: 'indicadores →', back: '← responsables' },
    { id: 'argos', name: 'ARGOS', sub: 'Laboratorio', ic: 'eye', x: 1030, y: 460, edge: 'práctica →' },
  ];
  const node = (n, i) => {
    const w = 236, h = 74, x0 = n.x - w / 2, y0 = n.y - h / 2;
    return `<g class="in d${i + 2}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="18" fill="${t.s1}" stroke="${t.line2}"/>
<rect x="${x0 + 14}" y="${y0 + 15}" width="44" height="44" rx="12" fill="${t.s2}"/>${icon(n.ic, x0 + 25, y0 + 26, 22, t.acc)}
<text x="${x0 + 72}" y="${y0 + 33}" font-size="16" font-weight="600">${esc(n.name)}</text><text x="${x0 + 72}" y="${y0 + 54}" font-size="13" fill="${t.ink3}">${esc(n.sub)}</text></g>`;
  };
  const edge = (n) => {
    const left = n.x < cx; const sx = left ? n.x + 118 : cx + 100; const ex = left ? cx - 100 : n.x - 118;
    const sy = left ? n.y : cy + (n.y - cy) * .35; const ey = left ? cy + (n.y - cy) * .35 : n.y;
    const d = `M${sx} ${sy} C ${(sx + ex) / 2} ${sy}, ${(sx + ex) / 2} ${ey}, ${ex} ${ey}`;
    const mx = (sx + ex) / 2, my = (sy + ey) / 2;
    const lab = `${n.edge}${n.back ? ` ${n.back}` : ''}`; const lw = lab.length * 6.6 + 16;
    return `<path d="${d}" fill="none" stroke="${t.line2}" stroke-width="1.5"/><path d="${d}" fill="none" stroke="${t.acc}" stroke-width="1.5" class="flow" opacity=".7"/>
<g class="in d6"><rect x="${mx - lw / 2}" y="${my - 12}" width="${lw}" height="24" rx="12" fill="${t.bg}" stroke="${t.line}"/><text x="${mx}" y="${my + 4.5}" class="mono" font-size="11" text-anchor="middle" fill="${t.ink2}">${esc(lab)}</text></g>`;
  };
  const body = `${style(t, { fonts: true })}
<rect width="${W}" height="${H}" rx="28" fill="${t.bg}" stroke="${t.line}"/>
<text x="48" y="52" class="mono" font-size="12" letter-spacing=".08em" fill="${t.ink3}">SOBRE COMÚN «YRD-ECOSISTEMA» · JSON · VERSIÓN 1</text>
<text x="${W - 48}" y="52" font-size="13" text-anchor="end" fill="${t.ink3}">El usuario mueve el fichero: ninguna herramienta llama a otra por red.</text>
${nodes.map(edge).join('')}
${nodes.map(node).join('')}
<g class="in d1"><rect x="${cx - 100}" y="${cy - 70}" width="200" height="140" rx="24" fill="${t.s1}" stroke="${t.acc}" stroke-width="1.5"/>
<rect x="${cx - 26}" y="${cy - 50}" width="52" height="52" rx="14" fill="${t.accT}"/>${icon('waypoints', cx - 14, cy - 38, 28, t.acc)}
<text x="${cx}" y="${cy + 30}" font-size="18" font-weight="650" text-anchor="middle" letter-spacing="-.01em">CTEM-Nexus</text>
<text x="${cx}" y="${cy + 51}" font-size="13" text-anchor="middle" fill="${t.ink3}">Exposición y rutas de ataque</text></g>`;
  return svg(W, H, 'Ecosistema: KAIROS envía el BIA y recibe el riesgo de interrupción; Compliance Studio envía la SoA; ENS AD Auditor y MCP-Shield envían hallazgos; CTEM-Nexus envía evidencia a Rosetta y recibe el estado de los controles; envía indicadores a Norvik y recibe responsables; enlaza cada hallazgo con su máquina de ARGOS.', body);
}

/* ───────── Tarjetas ───────── */
const SIGNATURE = {
  // Rosetta: anillos de cumplimiento (su firma)
  rings: (t, x, y) => [[46, .82], [34, .64], [22, .9]].map(([r, p], i) => {
    const c = 2 * Math.PI * r;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${t.s3}" stroke-width="7"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${t.acc}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${x} ${y})" opacity="${1 - i * .22}" class="in d${i + 2}"/>`;
  }).join(''),
  // Studio: las 73 medidas del Anexo II
  grid: (t, x, y) => Array.from({ length: 73 }, (_, i) => {
    const c = i % 13, r = Math.floor(i / 13); const st = (i * 7) % 10;
    const fill = st < 6 ? t.acc : st < 8 ? t.accT : t.s3;
    return `<rect x="${x - 70 + c * 11}" y="${y - 34 + r * 11}" width="8" height="8" rx="2" fill="${fill}"/>`;
  }).join(''),
  // KAIROS: secuencia de recuperación frente al RTO
  gantt: (t, x, y) => [[0, 40], [30, 46], [62, 34], [70, 58]].map(([s, w], i) => `<rect x="${x - 70 + s}" y="${y - 40 + i * 20}" width="${w}" height="10" rx="5" fill="${i === 3 ? t.crit : t.acc}" opacity="${i === 3 ? .85 : 1}" class="in d${i + 2}"/>`).join('')
    + `<line x1="${x + 46}" y1="${y - 48}" x2="${x + 46}" y2="${y + 42}" stroke="${t.ink3}" stroke-dasharray="3 3"/><text x="${x + 46}" y="${y + 58}" class="mono" font-size="10.5" text-anchor="middle" fill="${t.ink3}">RTO</text>`,
  // CTEM-Nexus: franjas por activo (su firma)
  lanes: (t, x, y) => [[[92, 1], [60, 0]], [[84, 0], [40, 0]], [[71, 0], [33, 0], [18, 0]], [[52, 0]]].map((dots, i) => `<line x1="${x - 76}" y1="${y - 36 + i * 24}" x2="${x + 76}" y2="${y - 36 + i * 24}" stroke="${t.s3}" stroke-width="2"/>`
    + dots.map(([v, kev]) => `<circle cx="${x - 76 + v * 1.52}" cy="${y - 36 + i * 24}" r="5.5" fill="${v > 80 ? t.crit : v > 60 ? t.warn : t.acc}"/>${kev ? `<circle cx="${x - 76 + v * 1.52}" cy="${y - 36 + i * 24}" r="9" fill="none" stroke="${t.ink}" stroke-width="1.5"/>` : ''}`).join('')).join(''),
  // ENS AD Auditor: ruta hacia Domain Admins
  path: (t, x, y) => [[-66, 18], [-24, -14], [18, 14], [62, -16]].map(([dx, dy], i, a) => (i ? `<line x1="${x + a[i - 1][0]}" y1="${y + a[i - 1][1]}" x2="${x + dx}" y2="${y + dy}" stroke="${t.line2}" stroke-width="2"/>` : '')).join('')
    + [[-66, 18], [-24, -14], [18, 14], [62, -16]].map(([dx, dy], i) => `<circle cx="${x + dx}" cy="${y + dy}" r="${i === 3 ? 13 : 8}" fill="${i === 3 ? t.accT : t.s2}" stroke="${i === 3 ? t.acc : t.ink3}" stroke-width="1.75" class="in d${i + 2}"/>`).join('')
    + `<text x="${x + 62}" y="${y - 36}" class="mono" font-size="10.5" text-anchor="middle" fill="${t.ink3}">DA</text>`,
  // ARGOS: ojos que se abren con cada rango
  eyes: (t, x, y) => Array.from({ length: 10 }, (_, i) => `<circle cx="${x - 44 + (i % 5) * 28}" cy="${y - 14 + Math.floor(i / 5) * 28}" r="9" fill="${i < 6 ? t.accT : 'none'}" stroke="${i < 6 ? t.acc : t.s3}" stroke-width="2"/>${i < 6 ? `<circle cx="${x - 44 + (i % 5) * 28}" cy="${y - 14 + Math.floor(i / 5) * 28}" r="3.5" fill="${t.acc}"/>` : ''}`).join(''),
  // MCP-Shield: escudo que escanea y neutraliza paquetes (su firma)
  shield: (t, x, y) => {
    const k = 3.6, ox = x + 4 - 12 * k, oy = y - 12 * k;
    const d = 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z';
    const packets = [[-30, t.crit], [-2, t.warn], [26, t.crit]].map(([dy, c], i) => `<rect x="${x - 84}" y="${y + dy - 3}" width="16" height="6" rx="3" fill="${c}" class="in d${i + 2}"/><path d="M${x - 62} ${y + dy}h12" stroke="${t.line2}" stroke-width="1.5" stroke-dasharray="2 3"/>`).join('');
    return packets + `<g transform="translate(${ox} ${oy}) scale(${k})"><path d="${d}" fill="${t.accT}" stroke="${t.acc}" stroke-width="${(1.75 / k).toFixed(3)}" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="${t.acc}" stroke-width="${(2.2 / k).toFixed(3)}" stroke-linecap="round" stroke-linejoin="round"/></g>`
      + `<line x1="${x + 4 - 7.6 * k}" y1="${y + 6}" x2="${x + 4 + 7.6 * k}" y2="${y + 6}" stroke="${t.acc}" stroke-width="1.5" opacity=".55"/>`;
  },
  // Norvik: niveles de madurez
  maturity: (t, x, y) => [1, 2, 3, 4, 5].map((l, i) => `<rect x="${x - 70 + i * 30}" y="${y + 40 - l * 16}" width="22" height="${l * 16}" rx="5" fill="${i < 3 ? t.acc : t.s3}" opacity="${i < 3 ? .5 + i * .25 : 1}"/>`).join(''),
};

function card(th, c) {
  const t = THEMES[th];
  const W = 580, H = 210;
  const sig = c.sig ? SIGNATURE[c.sig](t, 470, 108) : '';
  const tw = c.sig ? 330 : 470;
  const body = `${style(t, { extra: '' })}
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="22" fill="${t.s1}" stroke="${t.line2}"/>
<g class="in"><rect x="26" y="26" width="48" height="48" rx="14" fill="${t.accT}"/>${icon(c.ic, 38, 38, 24, t.acc)}</g>
<g class="in d1"><text x="90" y="49" font-size="20" font-weight="650" letter-spacing="-.015em">${esc(c.name)}</text>
<text x="90" y="70" class="mono" font-size="12" fill="${t.ink3}">${esc(c.meta)}</text></g>
<g class="in d2">${c.desc.map((l, i) => `<text x="28" y="${110 + i * 22}" font-size="15" fill="${t.ink2}">${esc(l)}</text>`).join('')}</g>
<g class="in d3">${c.tags.reduce((acc, tag) => { const w = tag.length * 6.6 + 20; acc.out += `<rect x="${acc.x}" y="166" width="${w}" height="24" rx="12" fill="${t.s2}"/><text x="${acc.x + w / 2}" y="182" font-size="11.5" font-weight="500" text-anchor="middle" fill="${t.ink2}">${esc(tag)}</text>`; acc.x += w + 6; return acc; }, { x: 28, out: '' }).out}</g>
${sig}`;
  if (c.desc.some((l) => l.length * 7.6 > tw)) console.warn(`Texto largo en ${c.name}`);
  return svg(W, H, `${c.name}. ${c.desc.join(' ')}`, body);
}

const TOOLS = [
  { id: 'rosetta', name: 'Rosetta Multinorma', meta: 'v2.15 · web', ic: 'languages', sig: 'rings', desc: ['15 normas y leyes de la UE, EE. UU. y', 'Latinoamérica sobre 152 controles.'], tags: ['ENS', 'ISO 27001', 'NIS2', 'DORA', 'LATAM'] },
  { id: 'ctem', name: 'CTEM-Nexus', meta: 'v1.2 · web + API', ic: 'waypoints', sig: 'lanes', desc: ['Prioriza la exposición y dibuja las', 'rutas de ataque a los activos críticos.'], tags: ['KEV', 'EPSS', 'ATT&CK', 'BloodHound'] },
  { id: 'kairos', name: 'KAIROS', meta: 'v1.1 · web', ic: 'hourglass', sig: 'gantt', desc: ['BIA, BCP y DRP con la ruta crítica', 'de recuperación de cada función.'], tags: ['ISO 22301', 'op.cont', 'RTO · RPO'] },
  { id: 'studio', name: 'ENS Compliance Studio', meta: 'v2.2 · web', ic: 'shield-check', sig: 'grid', desc: ['Categorización, MAGERIT, SoA de las', '73 medidas y preauditoría del ENS.'], tags: ['RD 311/2022', 'MAGERIT', 'SoA'] },
  { id: 'adaudit', name: 'ENS AD Auditor', meta: 'v0.4 · web + motor local', ic: 'key-round', sig: 'path', desc: ['Directorio Activo frente al control', 'de acceso del ENS (op.acc).'], tags: ['Kerberos', 'AD CS', 'MAGERIT'] },
  { id: 'argos', name: 'ARGOS', meta: 'v1.3 · web', ic: 'eye', sig: 'eyes', desc: ['Laboratorio GRC al estilo HTB: rutas,', 'máquinas con flags y simulacros.'], tags: ['ENS', 'ISO 27001', 'ISO 22301'] },
  { id: 'mcpshield', name: 'MCP-Shield', meta: 'v1.6 · web', ic: 'bot', sig: 'shield', desc: ['Audita las configuraciones MCP de los', 'asistentes de IA, sin salir del navegador.'], tags: ['OWASP Agentic', 'SARIF', 'ISO 42001'] },
  { id: 'norvik', name: 'Norvik', meta: 'escritorio', ic: 'landmark', sig: 'maturity', desc: ['Gobernanza y madurez con informes', 'y evidencias de cumplimiento.'], tags: ['NIST CSF', 'CIS', 'RGPD'] },
];
/* Repositorios por categoría, en tarjeta compacta: nombre, repositorio, qué hace y etiquetas */
const REPOS = [
  { id: 'darkspear', name: 'Dark Spear', repo: 'dark_spear', ic: 'crosshair', desc: ['Auditoría autorizada por fases, con aprobación', 'humana en cada paso y un informe defendible.'], tags: ['Python', 'FastAPI', 'ATT&CK'] },
  { id: 'skadi', name: 'SKADI', repo: 'skadi', ic: 'radar', desc: ['Escáner web que orquesta herramientas abiertas', 'y resume los resultados con IA local.'], tags: ['Python', 'Ollama', 'Informes'] },
  { id: 'judas', name: 'JUDAS', repo: 'Judas_Pentesting-Tool', ic: 'network', desc: ['Auditoría de Active Directory en laboratorios', 'autorizados, con estado entre sesiones.'], tags: ['Python', 'Active Directory', 'HTB'] },
  { id: 'privesc', name: 'AD PrivEsc Lab', repo: 'AD-PrivEsc-Lab', ic: 'chevrons-up', desc: ['Escalada de privilegios en AD por firma,', 'no de memoria: reconocer y mitigar.'], tags: ['Laboratorio', 'Active Directory'] },
  { id: 'adcs', name: 'ADCS ESC Lab', repo: 'ADCS-ESC-Lab', ic: 'file-badge', desc: ['Configuraciones débiles de AD CS por su', 'firma, con su mitigación.'], tags: ['React 19', 'Certipy', 'PKI'] },
  { id: 'valhalla', name: 'Valhalla SOC', repo: 'Proyecto-Master-Ciberseguridad-Evolve-Yoandy', short: 'Proyecto del Máster', ic: 'shield', desc: ['Un SOC que cabe en un portátil: detecta,', 'investiga con IA local e informa.'], tags: ['Wazuh', 'Docker', 'IA local'] },
  { id: 'stormbreaker', name: 'Stormbreaker', repo: 'stormbreaker', ic: 'hard-drive', desc: ['Consola de análisis forense avanzado', 'para responder a incidentes.'], tags: ['DFIR', 'Forense'] },
  { id: 'heimdall', name: 'Heimdall TimeWatch', repo: 'heimdall-timewatch_DFIR', ic: 'clock', desc: ['Detecta la manipulación de marcas de', 'tiempo en NTFS, mapeada a ATT&CK.'], tags: ['DFIR', 'NTFS', 'ATT&CK'] },
  { id: 'camponorte', name: 'Campo Norte', repo: 'campo-norte2', ic: 'layers', desc: ['Torre de control logística para almacenes:', 'stock, ubicaciones, turnos y costes.'], tags: ['WMS', 'React', 'SaaS'] },
  { id: 'webexpress', name: 'Auditoría Web Express', repo: 'auditoria-ad-express', ic: 'globe', desc: ['Web del servicio de auditoría web express,', 'sin build y publicada en GitHub Pages.'], tags: ['HTML', 'CSS', 'JS'] },
  { id: 'todos', name: 'Todos los repositorios', repo: '', short: 'github.com/heindall92', ic: 'blocks', desc: ['32 repositorios: herramientas, laboratorios,', 'proyectos del máster y producto.'], tags: ['Ver todos'] },
  { id: 'portfolio', name: 'Portfolio', repo: 'yoandy-portfolio', short: 'yoandyramirez.com', ic: 'briefcase', desc: ['Proyectos, laboratorios, certificaciones', 'y contacto en una sola página.'], tags: ['Web', 'Portfolio'] },
];

function repoCard(th, c) {
  const t = THEMES[th];
  const W = 580, H = 150;
  const slug = c.short || `heindall92/${c.repo}`;
  const tags = [...c.tags].reverse().reduce((acc, tag) => { const w = tag.length * 6.4 + 18; acc.x -= w; acc.out += `<rect x="${acc.x}" y="22" width="${w}" height="22" rx="11" fill="${t.s2}"/><text x="${acc.x + w / 2}" y="37" font-size="11" font-weight="500" text-anchor="middle" fill="${t.ink2}">${esc(tag)}</text>`; acc.x -= 6; return acc; }, { x: W - 22, out: '' });
  const body = `${style(t)}
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="${t.s1}" stroke="${t.line2}"/>
<g class="in"><rect x="22" y="22" width="40" height="40" rx="12" fill="${t.accT}"/>${icon(c.ic, 32, 32, 20, t.acc)}</g>
<g class="in d1"><text x="76" y="39" font-size="17" font-weight="650" letter-spacing="-.01em">${esc(c.name)}</text>
<text x="76" y="58" class="mono" font-size="11.5" fill="${t.ink3}">${esc(slug.length > 34 ? slug.slice(0, 33) + '…' : slug)}</text></g>
<g class="in d2">${tags.out}</g>
<g class="in d3">${c.desc.map((l, i) => `<text x="22" y="${96 + i * 21}" font-size="14.5" fill="${t.ink2}">${esc(l)}</text>`).join('')}</g>`;
  if (c.desc.some((l) => l.length * 7.4 > W - 44)) console.warn(`Texto largo en ${c.name}`);
  if (tags.x < 300) console.warn(`Etiquetas largas en ${c.name}`);
  return svg(W, H, `${c.name} (${slug}). ${c.desc.join(' ')}`, body);
}

/* ───────── Botones de contacto ───────── */
const LINKS = [
  { id: 'portfolio', label: 'Portfolio', ic: 'globe' },
  { id: 'linkedin', label: 'LinkedIn', ic: 'briefcase' },
  { id: 'htb', label: 'Hack The Box', ic: 'target' },
  { id: 'thm', label: 'TryHackMe', ic: 'flag' },
  { id: 'email', label: 'Correo', ic: 'mail' },
];
function pill(th, l) {
  const t = THEMES[th];
  const w = Math.round(l.label.length * 8.4 + 62), H = 44;
  return svg(w, H, l.label, `${style(t)}<rect x=".5" y=".5" width="${w - 1}" height="${H - 1}" rx="22" fill="${t.s1}" stroke="${t.line2}"/>${icon(l.ic, 18, 13, 18, t.acc)}<text x="44" y="27.5" font-size="14.5" font-weight="550">${esc(l.label)}</text>`);
}

/* ───────── Stack ───────── */
function stack(th) {
  const t = THEMES[th];
  const W = 1200;
  const groups = [
    ['crosshair', 'Auditoría técnica', ['Nmap', 'Burp Suite', 'BloodHound', 'PingCastle', 'Nessus', 'OpenVAS', 'Nuclei', 'OWASP ZAP']],
    ['radar', 'Defensa y DFIR', ['Wazuh', 'Sysmon', 'Event Logs', 'Wireshark', 'Cowrie', 'NTFS / $MFT', 'MITRE ATT&CK']],
    ['scale', 'GRC', ['ENS (RD 311/2022)', 'ISO/IEC 27001', 'ISO 22301', 'ISO/IEC 42001', 'NIS2', 'DORA', 'NIST CSF 2.0', 'MAGERIT', 'CCN-STIC']],
    ['code-xml', 'Desarrollo', ['Python', 'FastAPI', 'TypeScript', 'React', 'Vite', 'Tailwind', 'Playwright', 'axe-core', 'Docker', 'Ollama']],
  ];
  let y = 40; let out = '';
  groups.forEach(([ic, title, items], gi) => {
    out += `<g class="in d${gi + 1}">${icon(ic, 40, y, 20, t.acc)}<text x="70" y="${y + 15}" font-size="15" font-weight="600">${esc(title)}</text>`;
    let x = 40, yy = y + 34;
    for (const it of items) {
      const w = it.length * 7.2 + 24;
      if (x + w > W - 40) { x = 40; yy += 38; }
      out += `<rect x="${x}" y="${yy}" width="${w}" height="30" rx="15" fill="${t.s2}" stroke="${t.line}"/><text x="${x + w / 2}" y="${yy + 19.5}" font-size="13" text-anchor="middle" fill="${t.ink2}">${esc(it)}</text>`;
      x += w + 8;
    }
    out += '</g>';
    y = yy + 62;
  });
  const H = y - 10;
  return svg(W, H, groups.map(([, g, i]) => `${g}: ${i.join(', ')}`).join('. '), `${style(t)}<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="${t.s1}" stroke="${t.line}"/>${out}`);
}

/* ───────── Salida ───────── */
fs.mkdirSync(path.join(OUT, 'cards'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'links'), { recursive: true });
for (const th of Object.keys(THEMES)) {
  write('hero', th, hero(th));
  write('stats', th, stats(th));
  write('ecosistema', th, ecosistema(th));
  write('stack', th, stack(th));
  for (const c of TOOLS) fs.writeFileSync(path.join(OUT, 'cards', `${c.id}-${th}.svg`), card(th, c));
  for (const c of REPOS) fs.writeFileSync(path.join(OUT, 'cards', `${c.id}-${th}.svg`), repoCard(th, c));
  for (const l of LINKS) fs.writeFileSync(path.join(OUT, 'links', `${l.id}-${th}.svg`), pill(th, l));
}
console.log(`OK: ${2 * (4 + TOOLS.length + REPOS.length + LINKS.length)} SVG en assets/`);
