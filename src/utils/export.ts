import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Capture an HTML element and download it as a high-quality JPG image.
 */
export async function downloadElementAsJpg(elementId: string, filename: string = 'bob-document.jpg'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolution for retina-crisp rendering
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = filename.endsWith('.jpg') ? filename : `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting JPG:', error);
    // Fallback: trigger print
    window.print();
  }
}

/**
 * Capture an HTML element and download it as an official PDF document.
 */
export async function downloadElementAsPdf(elementId: string, filename: string = 'bob-statement.pdf'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgWidth = 210; // A4 standard width in mm
    const pageHeight = 297; // A4 standard height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    window.print();
  }
}

/**
 * Capture an HTML element and return it as a Blob (PDF or JPG) for uploading to Google Drive.
 */
export async function captureElementAsBlob(
  elementId: string,
  filename: string,
  format: 'pdf' | 'jpg' = 'pdf'
): Promise<{ blob: Blob; mimeType: string; filename: string } | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return null;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    if (format === 'jpg') {
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(null);
              return;
            }
            const finalName = filename.endsWith('.jpg') ? filename : `${filename}.jpg`;
            resolve({ blob, mimeType: 'image/jpeg', filename: finalName });
          },
          'image/jpeg',
          0.95
        );
      });
    } else {
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output('blob');
      const finalName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      return { blob: pdfBlob, mimeType: 'application/pdf', filename: finalName };
    }
  } catch (err) {
    console.error('Error capturing element as blob:', err);
    return null;
  }
}

