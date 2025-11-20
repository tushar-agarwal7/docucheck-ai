// lib/client-pdf-extractor.ts


export async function extractPDFTextClient(file: File): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('extractPDFTextClient can only be called on the client side');
  }

  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    if (!fullText || fullText.trim().length === 0) {
      throw new Error("PDF contains no extractable text");
    }

    const cleanText = fullText
      .replace(/\s+/g, " ")
      .replace(/\n+/g, "\n")
      .trim();

    return cleanText;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract PDF text: ${error.message}`);
    }
    throw new Error("Failed to extract PDF text: Unknown error");
  }
}


export function validatePDF(file: File): { valid: boolean; error?: string } {
  if (file.type !== "application/pdf") {
    return { valid: false, error: "File must be a PDF" };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "PDF must be smaller than 10MB" };
  }

  if (file.size === 0) {
    return { valid: false, error: "PDF file is empty" };
  }

  return { valid: true };
}