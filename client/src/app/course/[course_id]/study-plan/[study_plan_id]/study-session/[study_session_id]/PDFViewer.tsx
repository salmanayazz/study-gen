'use client';

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFViewerProps {
  fileUrl: string;
  startPage?: number;
  endPage?: number;
  fileName?: string;
}

export default function PDFViewer({ fileUrl, startPage = 1, endPage, fileName }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  // array of page numbers to render
  const pagesToRender = [];
  if (numPages) {
    const lastPage = endPage && endPage <= numPages ? endPage : numPages;
    for (let i = startPage; i <= lastPage; i++) {
      pagesToRender.push(i);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">{fileName || "Document"}</h1>
      
      <div className="pdf-container p-2 rounded shadow-lg flex justify-center w-fit">
        <div className="inline-block">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {pagesToRender.map((pageNum) => (
              <Page key={pageNum} pageNumber={pageNum} />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
