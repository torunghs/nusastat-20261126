// Grafik SVG murni untuk NusaStat — tanpa pustaka, tanpa network.
// Setiap fungsi menerima data dan mengembalikan string SVG.
//
// Aturan sumbu yang dijaga di semua grafik: tick sumbu-Y selalu menutup
// seluruh rentang data (tick pertama <= nilai minimum, tick terakhir >=
// nilai maksimum), jadi batang dan garis tidak pernah meluber keluar area
// grafik.

const INK = "#0b3d3a";
const TEAL = "#147a6e";
const TEAL_DARK = "#0d5a51";
const AMBER = "#e8a33d";
const RUST = "#c65b39";
const GRID = "#d8d2c2";
const MUTED = "#6b6558";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Tick "rapi" yang selalu menutup [min, max]: awal <= min, akhir >= max. */
function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const start = Math.floor(min / s) * s;
  const end = Math.ceil(max / s) * s;
  const out = [];
  for (let v = start; v <= end + s * 0.001; v += s) out.push(Math.round(v * 100) / 100);
  return out;
}

function fmt(v, decimals = 1) {
  return v.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function gridLines(ticks, y, padL, w) {
  let g = "";
  for (const t of ticks) {
    g += `<line x1="${padL}" y1="${y(t)}" x2="${padL + w}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>`;
  }
  return g;
}

function yLabels(ticks, y, padL, decimals) {
  let g = "";
  for (const t of ticks) {
    g += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmt(t, decimals)}</text>`;
  }
  return g;
}

// Batang vertikal dengan label tahun; nilai negatif digambar di bawah nol.
export function barChart({ values, labels, width = 640, height = 300, color = TEAL, negColor = RUST, yLabel = "", decimals = 1 }) {
  const padL = 52, padR = 12, padT = 26, padB = 30;
  const w = width - padL - padR, h = height - padT - padB;
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const ticks = niceTicks(min, max, 4);
  const lo = Math.min(...ticks), hi = Math.max(...ticks);
  const y = (v) => padT + h - ((v - lo) / (hi - lo)) * h;
  const bw = w / values.length;
  let g = gridLines(ticks, y, padL, w) + yLabels(ticks, y, padL, decimals);
  values.forEach((v, i) => {
    const x = padL + i * bw + bw * 0.18;
    const bw2 = bw * 0.64;
    const yTop = y(Math.max(v, 0));
    const yBot = y(Math.min(v, 0));
    const fill = v < 0 ? negColor : color;
    g += `<rect x="${x.toFixed(1)}" y="${yTop.toFixed(1)}" width="${bw2.toFixed(1)}" height="${Math.max(1, yBot - yTop).toFixed(1)}" rx="3" fill="${fill}"><title>${esc(labels[i])}: ${fmt(v, decimals)}</title></rect>`;
    const labelY = v < 0 ? yBot + 16 : yTop - 5;
    g += `<text x="${(x + bw2 / 2).toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${fmt(v, decimals)}</text>`;
    g += `<text x="${(x + bw2 / 2).toFixed(1)}" y="${padT + h + 18}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(labels[i])}</text>`;
  });
  g += `<line x1="${padL}" y1="${y(0)}" x2="${padL + w}" y2="${y(0)}" stroke="${INK}" stroke-width="1.2"/>`;
  if (yLabel) g += `<text x="${padL}" y="12" font-size="11" fill="${MUTED}">${esc(yLabel)}</text>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik batang" style="width:100%;height:auto;display:block">${g}</svg>`;
}

// Garis dengan titik dan label nilai; area di bawah garis diberi bayangan tipis.
export function lineChart({ values, labels, width = 640, height = 300, color = TEAL, yLabel = "", decimals = 1, area = true }) {
  const padL = 52, padR = 16, padT = 26, padB = 30;
  const w = width - padL - padR, h = height - padT - padB;
  const min = Math.min(...values), max = Math.max(...values);
  const pad = (max - min) * 0.12 || 1;
  const ticks = niceTicks(min - pad, max + pad, 4);
  const lo = Math.min(...ticks), hi = Math.max(...ticks);
  const x = (i) => padL + (i / (values.length - 1)) * w;
  const y = (v) => padT + h - ((v - lo) / (hi - lo)) * h;
  let g = gridLines(ticks, y, padL, w) + yLabels(ticks, y, padL, decimals);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  if (area) {
    g += `<polygon points="${padL},${(padT + h).toFixed(1)} ${pts} ${padL + w},${(padT + h).toFixed(1)}" fill="${color}" opacity="0.08"/>`;
  }
  g += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  values.forEach((v, i) => {
    g += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4" fill="#fff" stroke="${color}" stroke-width="2"><title>${esc(labels[i])}: ${fmt(v, decimals)}</title></circle>`;
    g += `<text x="${x(i).toFixed(1)}" y="${(y(v) - 10).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${fmt(v, decimals)}</text>`;
    g += `<text x="${x(i).toFixed(1)}" y="${padT + h + 18}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(labels[i])}</text>`;
  });
  if (yLabel) g += `<text x="${padL}" y="12" font-size="11" fill="${MUTED}">${esc(yLabel)}</text>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik garis" style="width:100%;height:auto;display:block">${g}</svg>`;
}

// Donat dengan legenda di bawah.
export function donutChart({ items, width = 320, height = 320, colors = [TEAL, AMBER, RUST, "#7a9a4d", "#4d7a9a", "#8a7a5b"] }) {
  const cx = width / 2, cy = height / 2, r = Math.min(width, height) / 2 - 14, inner = r * 0.62;
  const total = items.reduce((a, b) => a + b.share, 0);
  let a0 = -Math.PI / 2;
  let g = "";
  items.forEach((it, i) => {
    const a1 = a0 + (it.share / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    g += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${colors[i % colors.length]}"><title>${esc(it.name)}: ${fmt(it.share, 1)}%</title></path>`;
    a0 = a1;
  });
  g += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="26" font-weight="700" fill="${INK}">100%</text>`;
  g += `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="${MUTED}">total pangsa</text>`;
  const legend = `<div class="legend">` + items.map((it, i) =>
    `<span class="legend-item"><span class="swatch" style="background:${colors[i % colors.length]}"></span>${esc(it.name)} — <strong>${fmt(it.share, 1)}%</strong></span>`
  ).join("") + `</div>`;
  return `<div class="donut-wrap"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik donat" style="width:100%;max-width:320px;height:auto;display:block;margin:0 auto">${g}</svg>${legend}</div>`;
}

// Batang horizontal; satu baris bisa ditonjolkan (highlight).
export function hbarChart({ items, valueKey, format, width = 640, height = 280, color = TEAL, highlight = null }) {
  const padL = 150, padR = 78, padT = 10, padB = 10;
  const rowH = (height - padT - padB) / items.length;
  const max = Math.max(...items.map((d) => d[valueKey]));
  let g = "";
  items.forEach((d, i) => {
    const y = padT + i * rowH + rowH * 0.22;
    const bh = rowH * 0.56;
    const bw = (d[valueKey] / max) * (width - padL - padR);
    const fill = d.name === highlight ? AMBER : color;
    const weight = d.name === highlight ? 700 : 400;
    g += `<text x="${padL - 10}" y="${y + bh / 2 + 4}" text-anchor="end" font-size="12" font-weight="${weight}" fill="${INK}">${esc(d.name)}</text>`;
    g += `<rect x="${padL}" y="${y.toFixed(1)}" width="${Math.max(2, bw).toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${fill}"><title>${esc(d.name)}: ${format(d[valueKey])}</title></rect>`;
    g += `<text x="${(padL + Math.max(2, bw) + 8).toFixed(1)}" y="${y + bh / 2 + 4}" font-size="12" font-weight="600" fill="${INK}">${format(d[valueKey])}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafik batang horizontal" style="width:100%;height:auto;display:block">${g}</svg>`;
}

// Sparkline kecil untuk strip sorotan di Beranda.
export function sparkline({ values, width = 220, height = 56, color = TEAL }) {
  const pad = 4;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const x = (i) => pad + (i / (values.length - 1)) * (width - pad * 2);
  const y = (v) => pad + (1 - (v - min) / span) * (height - pad * 2 - 14) + 7;
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = values[values.length - 1];
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Tren" style="width:100%;height:auto;display:block"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${x(values.length - 1).toFixed(1)}" cy="${y(last).toFixed(1)}" r="3.5" fill="${color}"/></svg>`;
}

export { TEAL_DARK };
