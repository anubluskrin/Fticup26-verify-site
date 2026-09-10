# Halaman Verifikasi Sertifikat — FTI Cup 26

Halaman yang muncul saat orang scan QR code di sertifikat mereka.
Menampilkan animasi intro strip warna, lalu kartu verifikasi berisi
nama, kategori juara, dan tombol unduh sertifikat.

## Struktur folder

```
site/
├── index.html          <- halaman utama
├── style.css
├── script.js
├── vercel.json
├── manifest.json       <- GANTI dengan hasil generate_sertifikat.py
├── assets/
│   ├── logo.svg
│   ├── fonts/
│   └── js/gsap.min.js
└── certs/               <- GANTI isinya dengan semua PDF hasil generate
```

## Cara pakai (setiap kali ada sertifikat baru)

1. Jalankan `generate_sertifikat.py` seperti biasa di folder generator kamu.
2. Copy **semua file PDF** dari folder `output/` generator ke folder
   `certs/` di sini (timpa yang lama).
3. Copy `manifest.json` dari folder `output/` generator, timpa
   `manifest.json` di sini.
4. Deploy (lihat langkah di bawah).

## Deploy ke Vercel

**Cara tercepat (tanpa install apapun):**
1. Buka https://vercel.com, daftar/login (bisa pakai GitHub/Google).
2. Klik "Add New" → "Project" → pilih "Deploy without Git" / drag
   folder `site/` ini langsung ke halaman upload Vercel.
3. Tunggu proses build selesai (situs statis, biasanya <30 detik).
4. Vercel kasih URL seperti `https://nama-project.vercel.app`.

**Cara dengan Vercel CLI (kalau mau update berkala lebih cepat):**
```
npm install -g vercel
cd site
vercel --prod
```
Setiap kali update `certs/` + `manifest.json`, tinggal jalankan
`vercel --prod` lagi dari folder yang sama — URL tetap sama.

## PENTING: sambungkan QR code ke URL asli

Setelah dapat URL dari Vercel (misal `https://fticup26-verify.vercel.app`),
buka `generate_sertifikat.py` di folder generator, cari baris:

```python
BASE_URL_VERIFIKASI = "https://cek-sertifikat-contoh.com/?id="
```

Ganti jadi:

```python
BASE_URL_VERIFIKASI = "https://fticup26-verify.vercel.app/?id="
```

Lalu jalankan ulang `python generate_sertifikat.py` — QR code di semua
sertifikat akan otomatis mengarah ke halaman verifikasi yang benar.
Deploy ulang folder `site/` (dengan PDF & manifest.json terbaru) setelah itu.

## Kustomisasi

- **Warna**: edit variabel di bagian atas `style.css` (`--dark`, `--green`, `--cream`)
- **Teks event/tanggal**: edit langsung di `index.html` bagian `.meta`
- **Durasi animasi intro**: edit angka `STRIPE_IN_MS`, `STRIPE_STAGGER_MS`,
  dst di bagian atas `script.js`
- **Jumlah strip**: ubah `STRIPE_COUNT` di `script.js`
