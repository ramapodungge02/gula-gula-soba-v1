/*  --- LOGIKA FORMULIR KONTAK --- */
/*
 * File: kirim_pesan.js
 * Lokasi: js/kirim_pesan.js
 * Fungsi: Mengatur pengiriman pesan formulir kontak ke WhatsApp dan simulasi Email via Mailpit Laragon
 */

let formKontak =
  document.getElementById("formKontak") ||
  document.getElementById("contact-form");
let statusEl =
  document.getElementById("statusEl") ||
  document.getElementById("status-pesan");

function inisialisasiElemen() {
  if (!formKontak) {
    formKontak =
      document.getElementById("formKontak") ||
      document.getElementById("contact-form");
  }
  if (!statusEl) {
    statusEl =
      document.getElementById("statusEl") ||
      document.getElementById("status-pesan");
  }
}

/* FUNGSI Kirim Pesan | Bagian -- Kontak Kami:
1. Simulasi Kirim Pesan via Email ke MailPit (dengan metode Fetch API) di Laragon.
*/
async function kirimPesanEmail(mailpit) {
  if (mailpit) mailpit.preventDefault();
  inisialisasiElemen();

  const nama =
    (
      formKontak?.nama ||
      formKontak?.name ||
      document.getElementById("contact-name")
    )?.value.trim() || "";
  const pesan =
    (
      formKontak?.pesan ||
      formKontak?.description ||
      document.getElementById("contact-desc")
    )?.value.trim() || "";

  if (nama === "" || pesan === "") {
    if (statusEl) statusEl.textContent = "Nama dan pesan wajib diisi.";
    return;
  }

  if (statusEl) statusEl.textContent = "Mengirim pesan ke Mailpit...";

  const payload = {
    From: { Email: "pengirim@gulagulasoba.test", Name: nama },
    To: [{ Email: "halo@gulagulasoba.test", Name: "Gula-Gula Soba Gorontalo" }],
    Subject: "Pesan Kontak dari " + nama + " - Gula-Gula Soba",
    Text: pesan,
  };

  try {
    const response = await fetch("http://127.0.0.1:8025/api/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.Error || `HTTP error ${response.status}`);
    }

    if (statusEl)
      statusEl.textContent =
        "Mantap! Pesan dari " + nama + " udah masuk ke Mailpit.";
    if (formKontak) formKontak.reset();
  } catch (err) {
    if (statusEl)
      statusEl.textContent =
        "Gagal kirim email: " +
        err.message +
        ". Pastiin Mailpit Laragon aktif (port 8025).";
    console.error(err);
  }
}

/* FUNGSI Kirim Pesan | Bagian -- Kontak Kami:
2. Simulasi Kirim Pesan (mode send text) ke nomor WhatsApp wa.me dari id `formKontak`
*/
function kirimPesanWA(wa) {
  if (wa) wa.preventDefault();
  inisialisasiElemen();

  const namaPengirim =
    (
      formKontak?.nama ||
      formKontak?.name ||
      document.getElementById("contact-name")
    )?.value.trim() || "";
  const pesanPengirim =
    (
      formKontak?.pesan ||
      formKontak?.description ||
      document.getElementById("contact-desc")
    )?.value.trim() || "";

  if (namaPengirim === "" || pesanPengirim === "") {
    if (statusEl) statusEl.textContent = "Nama dan pesan wajib diisi.";
    return;
  }

  const nomor = "6289618425850";
  const urlWhatsApp =
    "https://wa.me/" +
    nomor +
    "?text=" +
    encodeURIComponent(
      "Pesan dari " + namaPengirim + "\n\n" + "Isi Pesan: " + pesanPengirim,
    );
  window.open(urlWhatsApp, "_blank");
}

function pasangEventFormulir() {
  inisialisasiElemen();

  if (formKontak) {
    formKontak.addEventListener("submit", kirimPesanWA);
  }

  const btnWA = document.getElementById("btn-send-wa");
  const btnEmail = document.getElementById("btn-send-email");

  if (btnWA) {
    btnWA.addEventListener("click", kirimPesanWA);
  }

  if (btnEmail) {
    btnEmail.addEventListener("click", kirimPesanEmail);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", pasangEventFormulir);
} else {
  pasangEventFormulir();
}
