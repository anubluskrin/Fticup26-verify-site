// ============================================================
// 1. BANGUN STRIP INTRO — gradient acak per strip, palet brand
// ============================================================

const stripesContainer = document.getElementById("stripes");
const STRIPE_COUNT = 18;

const PALET = ["#151515", "#017547", "#efdfc0", "#0a3d29", "#080808"];

function warnaAcak(kecuali) {
  let c;
  do { c = PALET[Math.floor(Math.random() * PALET.length)]; } while (c === kecuali);
  return c;
}

function buatGradientAcak() {
  const arah = 270; // hampir horizontal, sedikit miring acak
  const c1 = warnaAcak();
  const c2 = warnaAcak(c1);
  const c3 = warnaAcak(c2);
  const stop1 = Math.round(15 + Math.random() * 20);
  const stop2 = Math.round(55 + Math.random() * 30);
  return `linear-gradient(${arah}deg, ${c1} 0%, ${c2} ${stop1}%, ${c3} ${stop2}%, ${c1} 100%)`;
}

for (let i = 0; i < STRIPE_COUNT; i++) {
  const el = document.createElement("div");
  el.className = "intro-stripe";
  el.style.backgroundImage = buatGradientAcak();
  stripesContainer.appendChild(el);
}

const stripes = document.querySelectorAll(".intro-stripe");
const page = document.querySelector(".page");
const introEl = document.getElementById("intro");

// ---- Logo besar yang menyapu kiri -> kanan mengikuti strip ----
const introLogo = document.createElement("img");
introLogo.src = "assets/logo.svg";
introLogo.alt = "";
introLogo.className = "intro-logo";
introEl.appendChild(introLogo);

// ============================================================
// 2. TIMELINE ANIMASI (CSS keyframes + timer, bukan rAF-driven)
//    strip masuk (nutup) -> tahan -> strip keluar (buka) + konten fade-in
//    logo besar menyapu dari kiri ke kanan selama proses berlangsung
// ============================================================

const STRIPE_IN_MS = 700;
const STRIPE_STAGGER_MS = 28;
const HOLD_MS = 120;
const STRIPE_OUT_MS = 550;
const STRIPE_OUT_STAGGER_MS = 18;

function jalankanIntro() {
  const waktuSemuaMasuk = STRIPE_IN_MS + (stripes.length - 1) * STRIPE_STAGGER_MS;
  const waktuSemuaKeluar = STRIPE_OUT_MS + (stripes.length - 1) * STRIPE_OUT_STAGGER_MS;
  const totalDurasi = waktuSemuaMasuk + HOLD_MS + waktuSemuaKeluar;

  stripes.forEach((el, i) => {
    el.style.animationDelay = `${i * STRIPE_STAGGER_MS}ms`;
    el.classList.add("play-in");
  });

  // logo menyapu sepanjang durasi total intro (masuk + tahan + keluar)
  introLogo.style.animation = `logoSweep ${totalDurasi}ms cubic-bezier(0.65,0,0.35,1) forwards`;

  setTimeout(() => {
    page.classList.add("visible");
  }, waktuSemuaMasuk + HOLD_MS - 250);

  setTimeout(() => {
    stripes.forEach((el, i) => {
      el.style.animationDelay = `${i * STRIPE_OUT_STAGGER_MS}ms`;
      el.classList.remove("play-in");
      el.classList.add("play-out");
    });
  }, waktuSemuaMasuk + HOLD_MS);

  setTimeout(() => {
    introEl.style.display = "none";
  }, totalDurasi);
}

// Hormati preferensi pengguna yang mematikan animasi
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  introEl.style.display = "none";
  page.classList.add("visible");
} else {
  jalankanIntro();
}

// ============================================================
// 3. AMBIL DATA SERTIFIKAT DARI manifest.json BERDASARKAN ?id=
// ============================================================

async function verifikasiSertifikat() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const card = document.getElementById("card");
  const notfound = document.getElementById("notfound");

  if (!id) {
    statusDot.classList.add("err");
    statusText.textContent = "Tidak ada kode sertifikat";
    card.style.display = "none";
    notfound.style.display = "block";
    return;
  }

  try {
    const res = await fetch("manifest.json");
    const data = await res.json();
    const peserta = data.find((d) => d.id === id);

    if (!peserta) {
      statusDot.classList.add("err");
      statusText.textContent = "Kode tidak valid";
      card.style.display = "none";
      notfound.style.display = "block";
      return;
    }

    statusDot.classList.add("ok");
    statusText.textContent = "Sertifikat terverifikasi";

    document.getElementById("certName").textContent = peserta.nama;
    document.getElementById("certCategory").textContent = peserta.kategori;
    document.getElementById("certId").textContent = peserta.id;
    document.getElementById("downloadBtn").href = `certs/${peserta.file_pdf}`;
  } catch (e) {
    statusDot.classList.add("err");
    statusText.textContent = "Gagal memuat data sertifikat";
    card.style.display = "none";
    notfound.style.display = "block";
  }
}

verifikasiSertifikat();
