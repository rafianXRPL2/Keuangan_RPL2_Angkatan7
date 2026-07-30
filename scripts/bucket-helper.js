/**
 * Script Otomatis Management & Upload Storage Bucket Firebase
 * Kas Kelas XI RPL 2
 */

import { initializeApp } from 'firebase/app';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref, set } from 'firebase/database';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
  apiKey: "AIzaSyCcSM503poiTpJ5222Nihp-PeSaeH1Z2VE",
  authDomain: "keuangan-rpl2-angkatan7.firebaseapp.com",
  projectId: "keuangan-rpl2-angkatan7",
  storageBucket: "keuangan-rpl2-angkatan7.firebasestorage.app",
  messagingSenderId: "279828699723",
  appId: "1:279828699723:web:9ba1ba3e74f77fd22e0bce",
  databaseURL: "https://keuangan-rpl2-angkatan7-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

async function main() {
  const args = process.argv.slice(2);
  let localFile = args[0] || 'public/qris.jpeg';
  let bucketPath = args[1] || `bukti/qris/qris_${Date.now()}.jpeg`;

  const absoluteLocalPath = path.resolve(localFile);

  if (!fs.existsSync(absoluteLocalPath)) {
    console.error(`❌ File lokal tidak ditemukan: ${absoluteLocalPath}`);
    process.exit(1);
  }

  console.log(`🚀 Membaca file: ${absoluteLocalPath}`);
  const fileBuffer = fs.readFileSync(absoluteLocalPath);

  const fileRef = storageRef(storage, bucketPath);

  console.log(`⏳ Mengunggah ke Firebase Storage Bucket [${bucketPath}]...`);
  try {
    const snapshot = await uploadBytes(fileRef, fileBuffer, {
      contentType: getMimeType(localFile)
    });
    console.log(`\n✅ File BERHASIL diunggah ke Storage Bucket!`);

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(`\n🔗 Public Download URL:`);
    console.log(`👉 ${downloadURL}\n`);

    if (args.includes('--save-qris')) {
      await set(ref(database, 'URL_QRIS_Utama'), downloadURL);
      console.log(`📌 Database URL_QRIS_Utama berhasil diperbarui ke realtime cloud!`);
    }
  } catch (error) {
    if (error.code === 'storage/unknown' || error.status_ === 404) {
      console.log(`\n⚠️  [INFORMASI BUCKET FIREBASE STORAGE]`);
      console.log(`Bucket Firebase Storage untuk project "${firebaseConfig.projectId}" belum diaktifkan di Google Console.`);
      console.log(`\n📌 Langkah mudah 1-Klik membuat Bucket di Firebase Console:`);
      console.log(` 1. Buka: https://console.firebase.google.com/project/${firebaseConfig.projectId}/storage`);
      console.log(` 2. Klik tombol "Mulai" / "Get Started" di menu Storage.`);
      console.log(` 3. Pilih mode "Test mode" / "Public" lalu klik Selesai / Done.`);
      console.log(`\n💡 Catatan: Aplikasi web Next.js Anda SUDAH dilengkapi dengan sistem simpan gambar otomatis (Base64 Fallback), sehingga upload foto di web TETAP 100% BERHASIL walaupun bucket belum dibuat!`);
    } else {
      console.error(`❌ Error Storage:`, error.message);
    }
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

main();
