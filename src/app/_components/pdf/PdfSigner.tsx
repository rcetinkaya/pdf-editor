// components/pdf/PdfSigner.tsx

'use client';

import dynamic from 'next/dynamic';

const PdfSignerClient = dynamic(() => import('./PdfSignerClient'), {
  ssr: false, // ❗ SSR'de pdfjs hatası veriyor, bu yüzden kapatıyoruz
});

export default function PdfSignerWrapper() {
  return <PdfSignerClient />;
}
