'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState, useEffect } from 'react';
import EditModal from './EditModal';

export default function ContractEditorTiny() {
  const editorRef = useRef<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [initialText, setInitialText] = useState('');
  const [selectedSpan, setSelectedSpan] = useState<HTMLElement | null>(null);

  const initialContent = `
    <p>Bu sözleşme kapsamında taraflar aşağıdaki maddeleri kabul eder. Taraflardan herhangi biri yükümlülüklerini yerine getirmezse, diğer taraf tazminat talebinde bulunabilir.</p>
    <p><span class="highlight" title="Bu madde risk içerebilir. Yeniden gözden geçirilmeli.">Gizlilik hükümleri ihlal edilirse ağır yaptırımlar uygulanacaktır.</span></p>
  `;

  useEffect(() => {
    const interval = setInterval(() => {
      const editor = editorRef.current;
      if (!editor) return;
  
      const contentDom = editor.getBody();
      const spans = contentDom?.querySelectorAll('span.highlight');
      if (!spans || spans.length === 0) return;
  
      spans.forEach((span: Element) => {
        const clone = span.cloneNode(true) as HTMLElement;
        clone.classList.add('cursor-pointer');
        span.parentNode?.replaceChild(clone, span);
      });
  
      const newSpans = contentDom?.querySelectorAll('span.highlight');
      newSpans.forEach((span: Element) => {
        (span as HTMLElement).addEventListener('click', (e: MouseEvent) => {
          e.stopPropagation();
          setInitialText((span as HTMLElement).textContent ?? '');
          setSelectedSpan(span as HTMLElement);
          setEditModalOpen(true);
        });
      });
  
      clearInterval(interval);
    }, 300);
  
    return () => clearInterval(interval);
  }, []);
  
  
  

  return (
    <div className="p-4 border rounded">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(_, editor) => (editorRef.current = editor)}
        initialValue={initialContent}
        init={{
          height: 400,
          menubar: false,
          toolbar: 'undo redo | bold italic underline',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } .highlight { background-color: yellow; cursor: pointer; }',
        }}
      />

<EditModal
  open={editModalOpen}
  onClose={() => {
    setEditModalOpen(false);
    setInitialText('');
  }}
  initialText={initialText}
  onSave={(updatedText) => {
    if (selectedSpan && editorRef.current) {
      selectedSpan.textContent = updatedText;
  
      const editor = editorRef.current;
      const updatedHtml = editor.getBody().innerHTML;
  
      editor.setContent(updatedHtml); 
      console.log('Yeni içerik:', updatedHtml);
  
      setInitialText('');
      setSelectedSpan(null);
    }
  }}
  
/>

    </div>
  );
}
