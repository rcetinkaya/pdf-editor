import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const tryPaths = [
  'node_modules/pdfjs-dist/build/pdf.worker.min.js',
  'node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js',
];

const dest = join('public', 'pdf.worker.min.js');

if (!existsSync('public')) {
  mkdirSync('public');
}

let copied = false;

for (const path of tryPaths) {
  try {
    copyFileSync(path, dest);
    console.log(`✅ Worker kopyalandı: ${path} → ${dest}`);
    copied = true;
    break;
  } catch (err) {
    // bu yolu geç
  }
}

if (!copied) {
  console.error('❌ Worker dosyası bulunamadı. Lütfen pdfjs-dist yapısını kontrol et.');
}
