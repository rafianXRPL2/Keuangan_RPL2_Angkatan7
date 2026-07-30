/**
 * Script Otomatis Management & Upload Storage Bucket Supabase
 * Kas Kelas XI RPL 2
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const args = process.argv.slice(2);
  let localFile = args[0] || 'public/qris.jpeg';
  let bucketPath = args[1] || `qris/qris_${Date.now()}.jpeg`;

  const absoluteLocalPath = path.resolve(localFile);

  if (!fs.existsSync(absoluteLocalPath)) {
    console.error(`❌ File lokal tidak ditemukan: ${absoluteLocalPath}`);
    process.exit(1);
  }

  console.log(`🚀 Membaca file: ${absoluteLocalPath}`);
  const fileBuffer = fs.readFileSync(absoluteLocalPath);

  console.log(`⏳ Mengunggah ke Supabase Storage Bucket 'bukti' [${bucketPath}]...`);
  try {
    const { data, error } = await supabase.storage
      .from('bukti')
      .upload(bucketPath, fileBuffer, {
        contentType: getMimeType(localFile),
        upsert: true
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('bukti')
      .getPublicUrl(bucketPath);

    console.log(`\n✅ File BERHASIL diunggah ke Supabase Storage!`);
    console.log(`\n🔗 Public URL:`);
    console.log(`👉 ${publicUrlData.publicUrl}\n`);

    if (args.includes('--save-qris')) {
      await supabase.from('app_metadata').upsert({
        key: 'URL_QRIS_Utama',
        val: publicUrlData.publicUrl
      });
      console.log(`📌 Database URL_QRIS_Utama berhasil diperbarui ke Supabase!`);
    }
  } catch (error) {
    console.error(`❌ Error Storage:`, error.message);
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
