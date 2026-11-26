// Angka-angka NusaStat: seluruhnya dari publikasi resmi yang dirujuk di
// halaman Sumber. Nilai dibulatkan dari angka publikasi; yang berlabel
// "sekitar" adalah pembulatan/perkiraan dari angka resmi. Tidak ada angka
// yang dikarang.

export const META = {
  country: "Indonesia",
  siteName: "NusaStat",
  tagline: "Portal Statistik Indonesia",
  updated: "26 November 2026",
  dataYear: 2024,
};

// Delapan angka utama, BPS & Bank Dunia 2024 (kecuali disebut lain).
export const KPIS = [
  { id: "populasi", label: "Penduduk", value: "281,6 jt", note: "BPS, 2024", detail: "Proyeksi penduduk pertengahan 2024" },
  { id: "pdb", label: "PDB", value: "Rp22.139 T", note: "BPS, 2024", detail: "Harga berlaku; sekitar US$1,40 triliun" },
  { id: "pdbkapita", label: "PDB per kapita", value: "US$4.925", note: "Bank Dunia, 2024", detail: "Sekitar Rp78,6 juta per orang per tahun" },
  { id: "tumbuh", label: "Pertumbuhan ekonomi", value: "5,03%", note: "BPS, 2024", detail: "Tumbuh 5,03% dibanding 2023" },
  { id: "inflasi", label: "Inflasi (yoy)", value: "1,57%", note: "BPS, Des 2024", detail: "Inflasi tahun kalender 2024" },
  { id: "tpt", label: "Pengangguran terbuka", value: "4,91%", note: "BPS, Agu 2024", detail: "Tingkat Pengangguran Terbuka" },
  { id: "miskin", label: "Penduduk miskin", value: "8,57%", note: "BPS, Sep 2024", detail: "Sekitar 24,06 juta jiwa" },
  { id: "ipm", label: "Indeks Pembangunan Manusia", value: "75,02", note: "BPS, 2024", detail: "Kategori tinggi" },
];

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Deret waktu 2015–2024 (BPS), urutan mengikuti YEARS.
export const SERIES = {
  pdbTumbuh: {
    label: "Pertumbuhan PDB",
    unit: "% per tahun",
    source: "BPS — Pertumbuhan Ekonomi, 2015–2024",
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
  },
  inflasi: {
    label: "Inflasi (yoy, Desember)",
    unit: "%",
    source: "BPS — Indeks Harga Konsumen, 2015–2024",
    values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
  },
  tpt: {
    label: "Pengangguran terbuka (Agustus)",
    unit: "%",
    source: "BPS — Sakernas, Agustus 2015–2024",
    values: [6.18, 5.61, 5.5, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
  },
  miskin: {
    label: "Penduduk miskin (September)",
    unit: "%",
    source: "BPS — Kemiskinan, September 2015–2024",
    values: [11.13, 10.7, 10.12, 9.66, 9.22, 9.78, 9.71, 9.54, 9.36, 8.57],
  },
  ekspor: {
    label: "Nilai ekspor",
    unit: "US$ miliar",
    source: "BPS — Statistik Ekspor, 2015–2024",
    values: [150.4, 144.4, 168.8, 180.0, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7],
  },
  penduduk: {
    label: "Jumlah penduduk",
    unit: "juta jiwa",
    source: "BPS — Sensus Penduduk 2010 & 2020, proyeksi 2015–2024",
    values: [255.5, 258.7, 261.9, 265.0, 268.1, 270.2, 272.7, 275.8, 278.7, 281.6],
  },
};

// Struktur PDB menurut lapangan usaha, 2024 (BPS, sekitar).
export const SECTORS = [
  { name: "Industri pengolahan", share: 18.7 },
  { name: "Perdagangan", share: 13.0 },
  { name: "Pertanian, kehutanan, perikanan", share: 12.5 },
  { name: "Konstruksi", share: 10.2 },
  { name: "Pertambangan & penggalian", share: 9.0 },
  { name: "Lainnya", share: 36.6 },
];

// Penduduk menurut pulau, Sensus Penduduk 2020 (BPS).
export const ISLANDS = [
  { name: "Jawa", share: 56.1, pop: 151.6 },
  { name: "Sumatera", share: 21.7, pop: 58.6 },
  { name: "Sulawesi", share: 7.4, pop: 19.9 },
  { name: "Kalimantan", share: 6.3, pop: 16.9 },
  { name: "Bali & Nusa Tenggara", share: 5.5, pop: 14.8 },
  { name: "Maluku & Papua", share: 3.0, pop: 8.1 },
];

// 10 provinsi berpenduduk terbanyak, Sensus Penduduk 2020 (BPS).
export const PROVINCES = [
  { name: "Jawa Barat", pop: 48.27, share: 17.9, capital: "Bandung" },
  { name: "Jawa Timur", pop: 40.67, share: 15.1, capital: "Surabaya" },
  { name: "Jawa Tengah", pop: 36.52, share: 13.5, capital: "Semarang" },
  { name: "Sumatera Utara", pop: 14.80, share: 5.5, capital: "Medan" },
  { name: "Banten", pop: 11.91, share: 4.4, capital: "Serang" },
  { name: "DKI Jakarta", pop: 10.56, share: 3.9, capital: "Jakarta" },
  { name: "Sulawesi Selatan", pop: 9.07, share: 3.4, capital: "Makassar" },
  { name: "Lampung", pop: 9.01, share: 3.3, capital: "Bandar Lampung" },
  { name: "Sumatera Selatan", pop: 8.47, share: 3.1, capital: "Palembang" },
  { name: "Riau", pop: 6.39, share: 2.4, capital: "Pekanbaru" },
];

// Kelompok umur penduduk, Sensus Penduduk 2020 (BPS, sekitar).
export const AGE_GROUPS = [
  { name: "0–14 tahun (anak)", share: 24.4 },
  { name: "15–64 tahun (produktif)", share: 68.6 },
  { name: "65+ tahun (lansia)", share: 7.0 },
];

// Agama penduduk, 2024 (BPS / Kementerian Agama, sekitar).
export const RELIGIONS = [
  { name: "Islam", share: 87.1 },
  { name: "Kristen Protestan", share: 7.4 },
  { name: "Katolik", share: 3.0 },
  { name: "Hindu", share: 1.7 },
  { name: "Buddha", share: 0.7 },
  { name: "Konghucu & lainnya", share: 0.1 },
];

// Kesehatan & pendidikan (2024).
export const HEALTH_EDU = [
  { label: "Angka harapan hidup", value: "74,1 tahun", source: "BPS, 2024" },
  { label: "Balita stunting", value: "19,8%", source: "SSGI Kemenkes, 2024" },
  { label: "Rata-rata lama sekolah", value: "9,05 tahun", source: "BPS, 2024" },
  { label: "Harapan lama sekolah", value: "13,33 tahun", source: "BPS, 2024" },
  { label: "Angka melek huruf (15+)", value: "96,4%", source: "BPS, 2024 (sekitar)" },
  { label: "Pengguna internet", value: "221,6 jt jiwa (79,5%)", source: "APJII, 2024" },
];

// Perdagangan luar negeri 2024 (BPS).
export const TRADE = {
  ekspor: 264.7,
  impor: 233.7,
  surplus: 31.0,
  unit: "US$ miliar",
  source: "BPS — Statistik Ekspor Impor, 2024",
};

// Perbandingan dengan negara tetangga, 2024 (Bank Dunia, sekitar).
export const COMPARE = [
  { name: "Indonesia", pop: 283.5, gdpCap: 4925, growth: 5.0 },
  { name: "Malaysia", pop: 34.1, gdpCap: 13140, growth: 5.1 },
  { name: "Singapura", pop: 6.0, gdpCap: 90670, growth: 4.4 },
  { name: "Thailand", pop: 71.7, gdpCap: 7300, growth: 2.5 },
  { name: "Vietnam", pop: 101.0, gdpCap: 4710, growth: 7.1 },
  { name: "Filipina", pop: 114.9, gdpCap: 3900, growth: 5.7 },
];

export const SOURCES = [
  { name: "Badan Pusat Statistik (BPS)", what: "Penduduk, PDB, inflasi, pengangguran, kemiskinan, IPM, harapan hidup, lama sekolah, ekspor-impor", year: "2015–2024", url: "bps.go.id" },
  { name: "Bank Dunia (World Bank)", what: "PDB per kapita dan angka pembanding negara tetangga", year: "2024", url: "data.worldbank.org" },
  { name: "Survei Status Gizi Indonesia (SSGI), Kemenkes", what: "Prevalensi stunting balita", year: "2024", url: "kemkes.go.id" },
  { name: "APJII — Survei Penetrasi Internet", what: "Jumlah pengguna internet Indonesia", year: "2024", url: "apjii.or.id" },
  { name: "Sensus Penduduk 2020 (BPS)", what: "Penduduk menurut provinsi, pulau, kelompok umur, dan ibu kota provinsi", year: "2020", url: "bps.go.id" },
];
