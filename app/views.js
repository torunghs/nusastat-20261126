// Halaman-halaman NusaStat: dirender dari data.js ke dalam #view.
// Router memakai hash (#/, #/ekonomi, ...) sehingga tiap halaman punya tautan.

import { META, KPIS, YEARS, SERIES, SECTORS, ISLANDS, PROVINCES, AGE_GROUPS, RELIGIONS, HEALTH_EDU, TRADE, COMPARE, SOURCES } from "./data.js";
import { barChart, lineChart, donutChart, hbarChart, sparkline } from "./charts.js";

const view = document.getElementById("view");
const navLinks = [...document.querySelectorAll("[data-route]")];

function fmtId(v, d = 1) {
  return v.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function sourceLine(text) {
  return `<p class="source">Sumber: ${text}</p>`;
}

function kpiCards() {
  return `<section class="kpi-grid" aria-label="Indikator utama">` + KPIS.map((k) => `
    <article class="kpi">
      <h3>${k.label}</h3>
      <p class="kpi-value">${k.value}</p>
      <p class="kpi-note">${k.note}</p>
      <p class="kpi-detail">${k.detail}</p>
    </article>`).join("") + `</section>`;
}

function sliceYears(range) {
  if (range === "awal") return { years: YEARS.slice(0, 5), idx: [0, 1, 2, 3, 4] };
  if (range === "akhir") return { years: YEARS.slice(5), idx: [5, 6, 7, 8, 9] };
  return { years: YEARS, idx: YEARS.map((_, i) => i) };
}

// ---------- Beranda ----------
function pageHome() {
  const growth = SERIES.pdbTumbuh;
  const pop = SERIES.penduduk;
  return `
  <section class="hero">
    <p class="eyebrow">Statistik resmi · diperbarui ${META.updated}</p>
    <h1>Indonesia dalam angka</h1>
    <p class="lede">Penduduk, ekonomi, kesehatan, dan pendidikan Indonesia — dari data resmi
    Badan Pusat Statistik dan Bank Dunia — disajikan dalam grafik yang bisa dijelajahi.</p>
    <div class="hero-strip" aria-label="Angka utama 2024">
      <div class="hero-stat"><span class="hero-stat-value">281,6 jt</span><span class="hero-stat-label">Penduduk · BPS 2024</span></div>
      <div class="hero-stat"><span class="hero-stat-value">5,03%</span><span class="hero-stat-label">Pertumbuhan PDB · BPS 2024</span></div>
      <div class="hero-stat"><span class="hero-stat-value">75,02</span><span class="hero-stat-label">IPM · BPS 2024</span></div>
      <div class="hero-stat"><span class="hero-stat-value">8,57%</span><span class="hero-stat-label">Penduduk miskin · BPS 2024</span></div>
    </div>
    <div class="hero-links">
      <a class="btn" href="#/ekonomi">Lihat ekonomi →</a>
      <a class="btn btn-ghost" href="#/demografi">Lihat demografi →</a>
      <a class="btn btn-ghost" href="#/provinsi">Jelajahi provinsi →</a>
    </div>
  </section>
  ${kpiCards()}
  <section class="grid-2">
    <article class="card">
      <h2>Pertumbuhan ekonomi 2015–2024</h2>
      <p class="card-sub">PDB tumbuh 5,03% pada 2024 — pulih penuh dari kontraksi −2,07% saat pandemi 2020.</p>
      ${barChart({ values: growth.values, labels: YEARS.map(String), yLabel: growth.unit })}
      ${sourceLine(growth.source)}
      <a class="text-link" href="#/ekonomi">Ubah indikator &amp; rentang tahun →</a>
    </article>
    <article class="card">
      <h2>Penduduk terus bertambah</h2>
      <p class="card-sub">Dari 255,5 juta jiwa (2015) menjadi 281,6 juta jiwa (2024).</p>
      ${lineChart({ values: pop.values, labels: YEARS.map(String), yLabel: pop.unit, decimals: 1 })}
      ${sourceLine(pop.source)}
      <a class="text-link" href="#/demografi">Selengkapnya di halaman Demografi →</a>
    </article>
  </section>
  <section class="grid-2">
    <article class="card">
      <h2>Di mana penduduk tinggal?</h2>
      <p class="card-sub">Lebih dari separuh penduduk Indonesia tinggal di Pulau Jawa.</p>
      ${hbarChart({ items: ISLANDS, valueKey: "share", format: (v) => fmtId(v) + "%", highlight: "Jawa" })}
      ${sourceLine("BPS — Sensus Penduduk 2020")}
    </article>
    <article class="card">
      <h2>Struktur ekonomi 2024</h2>
      <p class="card-sub">Pangsa PDB menurut lapangan usaha (sekitar).</p>
      ${donutChart({ items: SECTORS })}
      ${sourceLine("BPS — PDB menurut Lapangan Usaha, 2024 (angka dibulatkan)")}
    </article>
  </section>
  <section class="grid-2">
    <article class="card">
      <h2>Perdagangan 2024</h2>
      <p class="big-num">Surplus US$${fmtId(TRADE.surplus, 1)} miliar</p>
      <p>Ekspor US$${fmtId(TRADE.ekspor, 1)} miliar · Impor US$${fmtId(TRADE.impor, 1)} miliar</p>
      ${sparkline({ values: SERIES.ekspor.values, color: "#147a6e" })}
      <p class="card-sub">Nilai ekspor 2015–2024 (US$ miliar).</p>
      ${sourceLine(TRADE.source)}
      <a class="text-link" href="#/ekonomi">Selengkapnya di halaman Ekonomi →</a>
    </article>
    <article class="card">
      <h2>Kesehatan &amp; pendidikan</h2>
      <p class="big-num">Harapan hidup 74,1 tahun</p>
      <p>Stunting balita 19,8% · rata-rata lama sekolah 9,05 tahun · IPM 75,02</p>
      ${sparkline({ values: SERIES.miskin.values, color: "#c65b39" })}
      <p class="card-sub">Kemiskinan menurun: dari 11,13% (2015) ke 8,57% (2024).</p>
      ${sourceLine("BPS &amp; SSGI Kemenkes, 2024")}
      <a class="text-link" href="#/kesehatan">Selengkapnya di halaman Kesehatan →</a>
    </article>
  </section>`;
}

// ---------- Ekonomi ----------
let econMetric = "pdbTumbuh";
let econRange = "semua";
let econKind = "batang";

function pageEkonomi() {
  const s = SERIES[econMetric];
  const { years, idx } = sliceYears(econRange);
  const vals = idx.map((i) => s.values[i]);
  const kind = econKind === "garis" || econMetric === "inflasi" || econMetric === "miskin" ? "garis" : "batang";
  const chart = kind === "garis"
    ? lineChart({ values: vals, labels: years.map(String), yLabel: s.unit })
    : barChart({ values: vals, labels: years.map(String), yLabel: s.unit });
  return `
  <section class="page-head">
    <h1>Ekonomi</h1>
    <p class="lede">Pertumbuhan, harga, pekerjaan, kemiskinan, dan perdagangan Indonesia 2015–2024.</p>
  </section>
  <section class="card">
    <h2>Jelajahi deret waktu</h2>
    <div class="controls">
      <label>Indikator
        <select id="metric-select" aria-label="Pilih indikator">
          ${Object.entries(SERIES).filter(([k]) => k !== "penduduk").map(([k, v]) =>
            `<option value="${k}" ${k === econMetric ? "selected" : ""}>${v.label}</option>`).join("")}
        </select>
      </label>
      <fieldset class="range-group" aria-label="Rentang tahun">
        <legend>Rentang tahun</legend>
        <button type="button" data-range="semua" class="${econRange === "semua" ? "active" : ""}">2015–2024</button>
        <button type="button" data-range="awal" class="${econRange === "awal" ? "active" : ""}">2015–2019</button>
        <button type="button" data-range="akhir" class="${econRange === "akhir" ? "active" : ""}">2020–2024</button>
      </fieldset>
      <fieldset class="range-group" aria-label="Jenis grafik">
        <legend>Jenis grafik</legend>
        <button type="button" data-kind="batang" class="${econKind === "batang" ? "active" : ""}">Batang</button>
        <button type="button" data-kind="garis" class="${econKind === "garis" ? "active" : ""}">Garis</button>
      </fieldset>
    </div>
    <h3 class="chart-title">${s.label} (${years[0]}–${years[years.length - 1]})</h3>
    ${chart}
    ${sourceLine(s.source)}
    <p class="reading">Nilai terakhir: <strong>${fmtId(vals[vals.length - 1])} ${s.unit}</strong> pada ${years[years.length - 1]}.
    Nilai terendah periode ini: <strong>${fmtId(Math.min(...vals))}</strong>, tertinggi: <strong>${fmtId(Math.max(...vals))}</strong>.</p>
  </section>
  <section class="grid-2">
    <article class="card">
      <h2>Struktur PDB 2024</h2>
      <p class="card-sub">Pangsa menurut lapangan usaha (sekitar).</p>
      ${donutChart({ items: SECTORS })}
      ${sourceLine("BPS — PDB menurut Lapangan Usaha, 2024 (angka dibulatkan)")}
    </article>
    <article class="card">
      <h2>Perdagangan luar negeri 2024</h2>
      <table class="data-table">
        <tbody>
          <tr><th scope="row">Ekspor</th><td>US$${fmtId(TRADE.ekspor, 1)} miliar</td></tr>
          <tr><th scope="row">Impor</th><td>US$${fmtId(TRADE.impor, 1)} miliar</td></tr>
          <tr><th scope="row">Neraca</th><td><strong>Surplus US$${fmtId(TRADE.surplus, 1)} miliar</strong></td></tr>
          <tr><th scope="row">PDB harga berlaku</th><td>Rp22.139 triliun</td></tr>
          <tr><th scope="row">PDB per kapita</th><td>US$4.925</td></tr>
          <tr><th scope="row">Kurs rata-rata</th><td>sekitar Rp15.900 per US$</td></tr>
        </tbody>
      </table>
      ${sourceLine(TRADE.source + "; Bank Dunia, 2024")}
    </article>
  </section>`;
}

// ---------- Demografi ----------
function pageDemografi() {
  return `
  <section class="page-head">
    <h1>Demografi</h1>
    <p class="lede">281,6 juta jiwa pada 2024 — negara berpenduduk terbesar keempat di dunia.</p>
  </section>
  <section class="card">
    <h2>Pertumbuhan penduduk 2015–2024</h2>
    ${lineChart({ values: SERIES.penduduk.values, labels: YEARS.map(String), yLabel: SERIES.penduduk.unit, decimals: 1 })}
    ${sourceLine(SERIES.penduduk.source)}
  </section>
  <section class="grid-2">
    <article class="card">
      <h2>Penduduk menurut pulau</h2>
      ${hbarChart({ items: ISLANDS, valueKey: "share", format: (v) => fmtId(v) + "%", highlight: "Jawa" })}
      ${sourceLine("BPS — Sensus Penduduk 2020")}
    </article>
    <article class="card">
      <h2>Agama penduduk</h2>
      ${donutChart({ items: RELIGIONS, colors: ["#147a6e", "#e8a33d", "#c65b39", "#7a9a4d", "#4d7a9a", "#8a7a5b"] })}
      ${sourceLine("BPS / Kementerian Agama, 2024 (sekitar)")}
    </article>
  </section>
  <section class="grid-2">
    <article class="card">
      <h2>Kelompok umur</h2>
      <p class="card-sub">Indonesia masih menikmati bonus demografi: hampir 7 dari 10 penduduk berusia produktif.</p>
      ${donutChart({ items: AGE_GROUPS, colors: ["#147a6e", "#e8a33d", "#c65b39"] })}
      ${sourceLine("BPS — Sensus Penduduk 2020 (sekitar)")}
    </article>
    <article class="card">
      <h2>Sepintas demografi</h2>
      <table class="data-table">
        <tbody>
          <tr><th scope="row">Luas wilayah</th><td>1.904.569 km²</td></tr>
          <tr><th scope="row">Kepadatan penduduk</th><td>sekitar 148 jiwa/km²</td></tr>
          <tr><th scope="row">Jumlah provinsi</th><td>38</td></tr>
          <tr><th scope="row">Usia median</th><td>sekitar 30,6 tahun</td></tr>
          <tr><th scope="row">Penduduk perkotaan</th><td>sekitar 59%</td></tr>
          <tr><th scope="row">Angka kelahiran total (TFR)</th><td>sekitar 2,0 anak per perempuan</td></tr>
        </tbody>
      </table>
      ${sourceLine("BPS, 2024")}
      <a class="text-link" href="#/provinsi">Lihat tabel 10 provinsi terbesar →</a>
    </article>
  </section>`;
}

// ---------- Provinsi ----------
let provQuery = "";
let provSort = "pop";
let provDir = -1;
let provSelected = null;

function provRows() {
  let rows = PROVINCES.filter((p) => p.name.toLowerCase().includes(provQuery.toLowerCase()) ||
    p.capital.toLowerCase().includes(provQuery.toLowerCase()));
  rows = [...rows].sort((a, b) => (a[provSort] < b[provSort] ? -1 : a[provSort] > b[provSort] ? 1 : 0) * provDir);
  return rows;
}

function pageProvinsi() {
  const rows = provRows();
  const sel = provSelected ? PROVINCES.find((p) => p.name === provSelected) : null;
  const arrow = (key) => provSort === key ? (provDir === -1 ? " ↓" : " ↑") : "";
  const top5 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 5);
  return `
  <section class="page-head">
    <h1>Provinsi</h1>
    <p class="lede">Sepuluh provinsi berpenduduk terbanyak menurut Sensus Penduduk 2020. Cari, urutkan, dan klik baris untuk detail.</p>
  </section>
  <section class="card">
    <h2>Lima provinsi terbesar</h2>
    <p class="card-sub">Tiga provinsi teratas — semuanya di Jawa — menampung hampir separuh penduduk Indonesia.</p>
    ${hbarChart({ items: top5, valueKey: "pop", format: (v) => fmtId(v, 2) + " jt", highlight: "Jawa Barat" })}
    ${sourceLine("BPS — Sensus Penduduk 2020")}
  </section>
  <section class="card">
    <div class="controls">
      <label>Cari provinsi atau ibu kota
        <input id="prov-search" type="search" placeholder="mis. Jawa, Medan…" value="${provQuery.replace(/"/g, "&quot;")}">
      </label>
    </div>
    <div class="table-wrap">
    <table class="data-table sortable">
      <thead>
        <tr>
          <th><button type="button" data-sort="name">Provinsi${arrow("name")}</button></th>
          <th><button type="button" data-sort="capital">Ibu kota${arrow("capital")}</button></th>
          <th><button type="button" data-sort="pop">Penduduk (juta)${arrow("pop")}</button></th>
          <th><button type="button" data-sort="share">Pangsa (%)${arrow("share")}</button></th>
        </tr>
      </thead>
      <tbody>
        ${rows.length ? rows.map((p) => `
        <tr data-prov="${p.name}" class="${sel && sel.name === p.name ? "selected" : ""}" tabindex="0">
          <td>${p.name}</td><td>${p.capital}</td><td>${fmtId(p.pop, 2)}</td><td>${fmtId(p.share, 1)}</td>
        </tr>`).join("") : `<tr><td colspan="4">Tidak ada provinsi yang cocok dengan “${provQuery}”.</td></tr>`}
      </tbody>
    </table>
    </div>
    ${sourceLine("BPS — Sensus Penduduk 2020")}
    ${sel ? `
    <aside class="detail" aria-live="polite">
      <h2>${sel.name}</h2>
      <p>Ibu kota <strong>${sel.capital}</strong> · penduduk <strong>${fmtId(sel.pop, 2)} juta jiwa</strong> ·
      pangsa <strong>${fmtId(sel.share, 1)}% dari penduduk Indonesia</strong> (Sensus 2020).</p>
      <p>Itu berarti sekitar ${Math.round(sel.pop * 1000000 / 281.6 / 10000)} dari setiap 10.000 penduduk Indonesia tinggal di ${sel.name}.</p>
    </aside>` : `<p class="hint">Klik salah satu baris untuk melihat detail provinsi.</p>`}
  </section>`;
}

// ---------- Kesehatan & Pendidikan ----------
function pageKesehatan() {
  return `
  <section class="page-head">
    <h1>Kesehatan &amp; Pendidikan</h1>
    <p class="lede">Seberapa panjang dan seberapa sehat hidup orang Indonesia, dan seberapa lama mereka bersekolah.</p>
  </section>
  ${kpiCards()}
  <section class="card">
    <h2>Indikator kesehatan &amp; pendidikan 2024</h2>
    <table class="data-table">
      <tbody>
        ${HEALTH_EDU.map((h) => `<tr><th scope="row">${h.label}</th><td><strong>${h.value}</strong></td><td>${h.source}</td></tr>`).join("")}
      </tbody>
    </table>
    <p class="reading">IPM Indonesia 2024 mencapai <strong>75,02</strong> — kategori tinggi — didorong membaiknya
    kesehatan, pendidikan, dan pengeluaran per kapita. Stunting balita turun ke 19,8%, masih di atas target
    nasional 14% pada 2024.</p>
    ${sourceLine("BPS, 2024; SSGI Kemenkes, 2024; APJII, 2024")}
  </section>
  <section class="card">
    <h2>Kemiskinan terus menurun</h2>
    <p class="card-sub">Persentase penduduk miskin, September 2015–2024.</p>
    ${lineChart({ values: SERIES.miskin.values, labels: YEARS.map(String), yLabel: "%", decimals: 2 })}
    ${sourceLine(SERIES.miskin.source)}
  </section>`;
}

// ---------- Bandingkan ----------
let cmpCountry = "Malaysia";
let cmpMetric = "gdpCap";

function pageBanding() {
  const metricLabel = cmpMetric === "gdpCap" ? "PDB per kapita (US$)" : cmpMetric === "pop" ? "Penduduk (juta jiwa)" : "Pertumbuhan ekonomi (%)";
  const fmt = cmpMetric === "gdpCap" ? (v) => "US$" + Math.round(v).toLocaleString("id-ID")
    : cmpMetric === "pop" ? (v) => fmtId(v) + " jt"
    : (v) => fmtId(v) + "%";
  const pair = [COMPARE[0], COMPARE.find((c) => c.name === cmpCountry)];
  const idn = COMPARE[0], other = pair[1];
  const ratio = cmpMetric === "gdpCap" ? other.gdpCap / idn.gdpCap : cmpMetric === "pop" ? other.pop / idn.pop : other.growth / idn.growth;
  return `
  <section class="page-head">
    <h1>Bandingkan dengan tetangga</h1>
    <p class="lede">Indonesia di samping negara-negara Asia Tenggara lainnya. Pilih negara dan indikator.</p>
  </section>
  <section class="card">
    <div class="controls">
      <label>Bandingkan Indonesia dengan
        <select id="cmp-country" aria-label="Pilih negara pembanding">
          ${COMPARE.slice(1).map((c) => `<option ${c.name === cmpCountry ? "selected" : ""}>${c.name}</option>`).join("")}
        </select>
      </label>
      <fieldset class="range-group" aria-label="Pilih indikator">
        <legend>Indikator</legend>
        <button type="button" data-metric="gdpCap" class="${cmpMetric === "gdpCap" ? "active" : ""}">PDB per kapita</button>
        <button type="button" data-metric="pop" class="${cmpMetric === "pop" ? "active" : ""}">Penduduk</button>
        <button type="button" data-metric="growth" class="${cmpMetric === "growth" ? "active" : ""}">Pertumbuhan</button>
      </fieldset>
    </div>
    <h3 class="chart-title">${metricLabel}: Indonesia vs ${other.name} (2024)</h3>
    ${hbarChart({ items: pair, valueKey: cmpMetric, format: fmt, highlight: "Indonesia" })}
    <p class="reading">${other.name} ${ratio >= 1 ? "lebih besar" : "lebih kecil"} — ${metricLabel.toLowerCase()} ${other.name}
    sekitar <strong>${fmtId(ratio, 2)}×</strong> Indonesia.</p>
    ${sourceLine("Bank Dunia, 2024 (angka sekitar)")}
  </section>
  <section class="card">
    <h2>Semua negara pembanding</h2>
    <table class="data-table">
      <thead><tr><th>Negara</th><th>Penduduk (juta)</th><th>PDB per kapita (US$)</th><th>Pertumbuhan (%)</th></tr></thead>
      <tbody>
        ${COMPARE.map((c) => `<tr class="${c.name === "Indonesia" ? "selected" : ""}"><td><strong>${c.name}</strong></td><td>${fmtId(c.pop)}</td><td>${Math.round(c.gdpCap).toLocaleString("id-ID")}</td><td>${fmtId(c.growth)}</td></tr>`).join("")}
      </tbody>
    </table>
    ${sourceLine("Bank Dunia, 2024 (angka sekitar)")}
  </section>`;
}

// ---------- Sumber ----------
function pageSumber() {
  return `
  <section class="page-head">
    <h1>Sumber data</h1>
    <p class="lede">Setiap angka di situs ini berasal dari publikasi resmi. Tahun data tercantum di tiap grafik dan tabel.</p>
  </section>
  <section class="card">
    <table class="data-table">
      <thead><tr><th>Sumber</th><th>Data yang dipakai</th><th>Tahun</th></tr></thead>
      <tbody>
        ${SOURCES.map((s) => `<tr><td><strong>${s.name}</strong><br><span class="muted">${s.url}</span></td><td>${s.what}</td><td>${s.year}</td></tr>`).join("")}
      </tbody>
    </table>
  </section>
  <section class="card">
    <h2>Tentang situs ini</h2>
    <p><strong>NusaStat</strong> adalah situs statistik mandiri tentang Indonesia, dibuat untuk kompetisi
    “Make the best national statistics site” di make.fun. Situs ini berupa berkas statis tanpa permintaan
    jaringan: semua data, gaya, dan skrip tersimpan di berkasnya sendiri, sehingga bisa dibuka di desktop
    maupun ponsel tanpa internet.</p>
    <p>Angka yang diberi label “sekitar” adalah pembulatan atau perkiraan dari angka resmi yang dipublikasikan.
    Angka deret waktu 2015–2024 diambil dari publikasi BPS; angka pembanding antarnegara dari Bank Dunia.</p>
    <p>Semua grafik digambar dengan SVG murni — tanpa pustaka eksternal. Desain, teks, dan nama situs ini orisinal.</p>
  </section>`;
}

const PAGES = {
  "/": pageHome,
  "/ekonomi": pageEkonomi,
  "/demografi": pageDemografi,
  "/provinsi": pageProvinsi,
  "/kesehatan": pageKesehatan,
  "/banding": pageBanding,
  "/sumber": pageSumber,
};

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const page = PAGES[hash] || PAGES["/"];
  view.innerHTML = page();
  navLinks.forEach((a) => {
    const r = a.getAttribute("data-route");
    a.classList.toggle("active", r === hash || (hash === "/" && r === "/"));
    if (r === hash || (hash === "/" && r === "/")) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
  const h1 = document.querySelector("#view h1");
  document.title = `NusaStat — ${h1 ? h1.textContent : "Portal Statistik Indonesia"}`;
}

function bindControls() {
  view.addEventListener("change", (e) => {
    const t = e.target;
    if (t.id === "metric-select") { econMetric = t.value; route(); }
    if (t.id === "cmp-country") { cmpCountry = t.value; route(); }
  });
  view.addEventListener("click", (e) => {
    const rangeBtn = e.target.closest("[data-range]");
    if (rangeBtn) { econRange = rangeBtn.dataset.range; route(); return; }
    const kindBtn = e.target.closest("[data-kind]");
    if (kindBtn) { econKind = kindBtn.dataset.kind; route(); return; }
    const metricBtn = e.target.closest("[data-metric]");
    if (metricBtn) { cmpMetric = metricBtn.dataset.metric; route(); return; }
    const sortBtn = e.target.closest("[data-sort]");
    if (sortBtn) {
      const key = sortBtn.dataset.sort;
      if (provSort === key) provDir *= -1; else { provSort = key; provDir = key === "name" || key === "capital" ? 1 : -1; }
      route(); return;
    }
    const row = e.target.closest("tr[data-prov]");
    if (row) { provSelected = row.dataset.prov; route(); }
  });
  view.addEventListener("input", (e) => {
    if (e.target.id === "prov-search") {
      provQuery = e.target.value;
      const pos = e.target.selectionStart;
      route();
      const input = document.getElementById("prov-search");
      if (input) { input.focus(); input.setSelectionRange(pos, pos); }
    }
  });
  view.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const row = e.target.closest("tr[data-prov]");
      if (row) { provSelected = row.dataset.prov; route(); }
    }
  });
}

window.addEventListener("hashchange", route);
bindControls();
route();
