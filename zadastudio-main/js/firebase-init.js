/* ZADA Yearbook — Firebase initialization
   Loaded via the firebase-*-compat.js CDN scripts (see <head> of each page),
   so `firebase` is a global namespace here. This file sets up `auth` and
   `db` as globals used by data.js / admin.js / school.js / main.js. */

const firebaseConfig = {
  apiKey: "AIzaSyDAKBUsGMOnlowUp5RvHrY3Cq_bT0z2rvY",
  authDomain: "zada-yearbook.firebaseapp.com",
  projectId: "zada-yearbook",
  storageBucket: "zada-yearbook.firebasestorage.app",
  messagingSenderId: "335111688172",
  appId: "1:335111688172:web:e9bb481088d21879177ac9",
  measurementId: "G-4S9B2CX973",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// NOTE: enablePersistence() dan experimentalForceLongPolling sengaja
// TIDAK dipakai. enablePersistence() bikin query lain ikut nunggu setup
// IndexedDB-nya kelar, dan di banyak device mobile itu bisa gantung
// selamanya — itu penyebab semua device (selain Chrome desktop) selalu
// nunjukin 0 sekolah. Kita udah punya cache manual (zada_schools_cache)
// jadi nggak butuh fitur ini.

/* Small helper: SHA-256 hash of a string, hex-encoded.
   Used to gate protected catalog content without ever storing or
   transmitting the raw school password to Firestore. */
async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
