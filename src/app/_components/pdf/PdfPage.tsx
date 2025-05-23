"use client";

import React, { useEffect, useRef, forwardRef } from "react";
import Draggable from "react-draggable";

interface SignatureBox {
  id: string;
  x: number;
  y: number;
  page: number;
  signatureImage?: string;
}

interface PdfPageProps {
  pageNumber: number;
  viewport: any;
  pdfDoc: any;
  signatureAreas: SignatureBox[];
  onDragStop: (id: string, data: { x: number; y: number }) => void;
  boxRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  pageRef?: (el: HTMLDivElement | null) => void;
  readOnly?: boolean;
}

const PdfPage = forwardRef<HTMLDivElement, PdfPageProps>(function PdfPage(
  { pageNumber, viewport, pdfDoc, signatureAreas, onDragStop, boxRefs, pageRef, readOnly },
  _
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const refMap = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  useEffect(() => {
    const draw = async () => {
      if (!canvasRef.current || !pdfDoc) return;

      const page = await pdfDoc.getPage(pageNumber);
      const context = canvasRef.current.getContext("2d");
      if (!context) return;

      canvasRef.current.width = viewport.width;
      canvasRef.current.height = viewport.height;

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
          await renderTaskRef.current.promise.catch(() => {});
        } catch (_) {}
      }

      try {
        const task = page.render({ canvasContext: context, viewport });
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("PDF render error:", err);
        }
      }
    };

    draw();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pageNumber, viewport, pdfDoc]);

  const getOrCreateRef = (id: string) => {
    if (!refMap.current[id]) {
      refMap.current[id] = React.createRef<HTMLDivElement>();
    }
    return refMap.current[id];
  };

  return (
    <div
      ref={pageRef}
      className="relative page-container border shadow rounded mx-auto w-full max-w-[800px] bg-white"
    >
      <canvas ref={canvasRef} className="block w-full h-auto z-0" />

      {signatureAreas
        .filter((box) => box.page === pageNumber)
        .map((box) => {
          const divRef = getOrCreateRef(box.id);
          const style = { left: `${box.x}px`, top: `${box.y}px` };

          return readOnly ? (
            <div
              key={box.id}
              ref={divRef}
              style={style}
              data-signature-id={box.id}
              className="absolute z-10 w-[150px] h-[60px] bg-white border-2 border-[#2563eb] flex items-center justify-center"
            >
              {box.signatureImage ? (
                <img
                  src={box.signatureImage}
                  alt="İmza"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-xs text-[#6b7280]">İmza Yüklenemedi</span>
              )}
            </div>
          ) : (
            <Draggable
              key={box.id}
              nodeRef={divRef as unknown as React.RefObject<HTMLElement>}
              defaultPosition={{ x: box.x, y: box.y }}
              onStop={(_, data) => onDragStop(box.id, data)}
              bounds="body"
            >
              <div
               ref={(el: HTMLDivElement | null) => {
                if (divRef) divRef.current = el;
                boxRefs.current[box.id] = el;
              }}              
                data-signature-id={box.id}
                className="absolute z-10 w-[150px] h-[60px] bg-white border-2 border-[#2563eb] cursor-move flex items-center justify-center"
              >
                {box.signatureImage ? (
                  <img
                    src={box.signatureImage}
                    alt="İmza"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-[#6b7280]">İmza Yüklenemedi</span>
                )}
              </div>
            </Draggable>
          );
        })}
    </div>
  );
});

export default PdfPage;
