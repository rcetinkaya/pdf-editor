"use client";

import { useRef, useState, useEffect } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/build/pdf';
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
import { v4 as uuidv4 } from 'uuid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SignatureUploadDialog from './SignatureUploadDialog';
import jsPDF from 'jspdf';
import PdfPage from './PdfPage';

interface SignatureBox {
  id: string;
  x: number;
  y: number;
  page: number;
  signatureImage?: string;
}

export default function PdfCanvasViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [signatureAreas, setSignatureAreas] = useState<SignatureBox[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const boxRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pdfPages, setPdfPages] = useState<{ pageNumber: number; viewport: any }[]>([]);
  const pdfDocRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setFileName(selected.name);
      setSignatureAreas([]);
    } else {
      alert('Lütfen geçerli bir PDF dosyası seçin.');
    }
  };

  const renderPdf = async () => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result as ArrayBuffer);
      const pdf = await getDocument({ data: typedarray }).promise;
      pdfDocRef.current = pdf;

      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        pages.push({ pageNumber: i, viewport });
      }

      setPdfPages(pages);
    };

    fileReader.readAsArrayBuffer(file);
  };

  const handleAddSignature = () => setIsDialogOpen(true);

  const handleSignatureConfirmed = (base64Image: string, page: number = 1) => {
    setSignatureAreas((prev) => [
      ...prev,
      {
        id: uuidv4(),
        x: 30,
        y: 30,
        page,
        signatureImage: base64Image,
      },
    ]);
    setIsDialogOpen(false);
  };

  const handleDragStop = (id: string, data: { x: number; y: number }) => {
    const signatureElement = boxRefs.current[id];
    if (!signatureElement) return;

    const boxRect = signatureElement.getBoundingClientRect();
    const centerY = boxRect.top + boxRect.height / 2;
    const pageContainers = document.querySelectorAll<HTMLElement>('.page-container');

    let newPage = 1;
    pageContainers.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (centerY >= rect.top && centerY <= rect.bottom) {
        newPage = index + 1;
      }
    });

    setSignatureAreas((prev) =>
      prev.map((box) =>
        box.id === id ? { ...box, x: data.x, y: data.y, page: newPage } : box
      )
    );
  };

  const handleExportAsPdf = async () => {
    const pageContainers = document.querySelectorAll<HTMLElement>('.page-container');
    if (!pageContainers.length) return;

    const firstContainer = pageContainers[0];
    if (!firstContainer) return;

    const firstCanvas = firstContainer.querySelector('canvas') as HTMLCanvasElement | null;
    if (!firstCanvas) return;

    const pdf = new jsPDF({
      unit: 'px',
      format: [firstCanvas.width, firstCanvas.height],
    });

    for (let i = 0; i < pageContainers.length; i++) {
      const container = pageContainers[i];
      if (!container) continue;

      const canvas = container.querySelector('canvas') as HTMLCanvasElement | null;
      if (!canvas) continue;

      const imgData = canvas.toDataURL('image/png');
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      if (i > 0) {
        pdf.addPage([canvasWidth, canvasHeight]);
      }

      pdf.setPage(i + 1);
      pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight);

      signatureAreas
        .filter((s) => s.page === i + 1)
        .forEach((s) => {
          const el = container.querySelector(`[data-signature-id="${s.id}"]`) as HTMLDivElement | null;
          if (!el) return;

          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const scaleX = canvas.width / container.clientWidth;
          const scaleY = canvas.height / container.clientHeight;

          const x = (rect.left - containerRect.left) * scaleX;
          const y = (rect.top - containerRect.top) * scaleY;

          pdf.addImage(s.signatureImage!, 'PNG', x, y, 150, 60);
        });
    }

    pdf.save('signed.pdf');
  };

  useEffect(() => {
    renderPdf();
  }, [file]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">PDF İmza Görüntüleyici (Canvas)</h2>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#cbd5e1] rounded-lg p-6 text-center cursor-pointer hover:border-[#3b82f6] hover:bg-[#eff6ff] transition"
      >
        <PictureAsPdfIcon className="mx-auto text-5xl text-[#ef4444] mb-2" />
        <p className="text-[#374151] font-medium">
          PDF dosyası seçmek için tıklayın veya sürükleyip bırakın
        </p>
        {fileName && <p className="text-sm text-[#6b7280] mt-2">Seçilen dosya: {fileName}</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {file && (
        <>
          <button
            onClick={handleAddSignature}
            className="bg-[#2563eb] text-white px-3 py-1 rounded hover:bg-[#1d4ed8] text-sm"
          >
            + İmza Alanı Ekle
          </button>
          {signatureAreas.length > 0 && (
            <div className="text-sm w-full text-gray-700 space-y-1">
              <h3 className="font-semibold mb-1">📌 İmza Konumları:</h3>
              {signatureAreas.map((s) => (
                <div key={s.id}>
                  • İmza ID: <span className="text-blue-600">{s.id.slice(0, 6)}...</span> –
                  Sayfa: {s.page} – x: {Math.round(s.x)}, y: {Math.round(s.y)}
                </div>
              ))}
            </div>
          )}
          <div className="pdf-wrapper space-y-8">
            {pdfPages.map(({ pageNumber, viewport }) => (
              <PdfPage
                key={pageNumber}
                pageNumber={pageNumber}
                viewport={viewport}
                pdfDoc={pdfDocRef.current}
                signatureAreas={signatureAreas}
                onDragStop={handleDragStop}
                boxRefs={boxRefs}
              />
            ))}
          </div>

          <button
            onClick={handleExportAsPdf}
            className="bg-[#2563eb] text-white hover:bg-[#1e40af] px-3 py-1 rounded text-sm mt-4"
          >
            PDF İmzayılı Kaydet
          </button>
        </>
      )}

      <SignatureUploadDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleSignatureConfirmed}
      />
    </div>
  );
}
