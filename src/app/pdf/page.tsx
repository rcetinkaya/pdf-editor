import PdfSignerWrapper from "../_components/pdf/PdfSigner";

export default function PdfPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDF İmza Sayfası</h1>
      <PdfSignerWrapper />
    </main>
  );
}
