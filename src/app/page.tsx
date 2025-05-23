import Link from "next/link";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-3xl font-bold">LegalX POC: Sözleşme & PDF İmza</h1>
        <p className="text-center text-lg text-gray-700">
          Bu POC, yapay zeka destekli sözleşme düzenleme ve PDF imzalama özelliklerini içerir.
        </p>

        <Link
          href="/editor"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
        >
          Sözleşme Editörüne Git
        </Link>
        <Link
          href="/pdf"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          PDF İmza Sayfasına Git
        </Link>

      </main>
    </HydrateClient>
  );
}
