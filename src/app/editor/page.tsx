'use client';

import ContractEditor from "../_components/editor/ContractEditor";

export default function EditorPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">AI Destekli Sözleşme Editörü</h1>
      <p className="mb-4 text-gray-700">
        Aşağıda, yapay zekanın işaretlediği sözleşme maddelerini düzenleyebilirsiniz.
      </p>

      <ContractEditor />
    </main>
  );
}
