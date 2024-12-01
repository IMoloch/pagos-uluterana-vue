import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useFirebaseService } from '../utilities/firebase.service'; // Importa tu servicio de Firebase

export function usePdf() {
  const firebaseSvc = useFirebaseService(); // Servicio de Firebase para subir archivos

  /**
   * Cargar el contenido HTML desde un archivo
   * @param {string} filePath - Ruta al archivo HTML
   * @returns {Promise<string>} - Contenido HTML cargado
   */
  const cargarHtml = async (filePath: string) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Error al cargar el archivo HTML: ${response.statusText}`);
      }
      const htmlContent = await response.text();
      return htmlContent;
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo cargar el contenido HTML');
    }
  };

  /**
   * Generar PDF correctamente con la información del pago
   * @param {string} ultimaFechaDePago - Última fecha de pago
   * @param {string} mesPagar - Mes a pagar
   * @param {Date} fechaActual - Fecha actual
   * @param {object} studentInfo - Información del estudiante
   * @returns {Promise<string>} - URL del PDF generado en Firebase Storage
   */
  const generarPdf = async (ultimaFechaDePago, mesPagar, fechaActual, studentInfo) => {
    const doc = new jsPDF();

    // Agregar los textos básicos al PDF
    doc.text(`Estudiante: ${studentInfo.name}`, 10, 10);
    doc.text(`Carnet: ${studentInfo.carnet}`, 10, 20);
    doc.text(`Última fecha de pago: ${ultimaFechaDePago}`, 10, 30);
    doc.text(`Mes a pagar: ${mesPagar}`, 10, 40);
    doc.text(`Fecha actual: ${fechaActual.toLocaleDateString()}`, 10, 50);
    doc.text(`Cantidad a pagar: $45 (No aplica Mora)`, 10, 60);

    try {
      // Cargar el contenido HTML desde el archivo
      const htmlContent = await cargarHtml('/assets/content.html');
      
      // Reemplazar las variables del HTML con los datos
      const filledHtmlContent = htmlContent
        .replace('{{carnet}}', studentInfo.carnet)
        .replace('{{ultimaFechaDePago}}', ultimaFechaDePago)
        .replace('{{mesPagar}}', mesPagar)
        .replace('{{fechaActual}}', fechaActual.toLocaleDateString());

      // Generar el PDF con el contenido HTML
      return new Promise((resolve, reject) => {
        doc.html(filledHtmlContent, {
          callback: async (pdf) => {
            // Añadir la tabla después de renderizar el HTML
            autoTable(pdf, {
              theme: 'plain',
              startY: pdf.previousAutoTable ? pdf.previousAutoTable.finalY + 10 : 80,
              head: [['Concepto', 'Descripción', 'Cantidad', 'Total']],
              body: [
                ['Matrícula', 'Pago correspondiente al ciclo', '$45', '$45'],
              ],
              foot: [['Total', '', '', '$45']],
              headStyles: { fontSize: 10 },
              bodyStyles: { fontSize: 10 },
              footStyles: { fontSize: 10 },
              columnStyles: {
                0: { cellWidth: 46, halign: 'center' },
                1: { cellWidth: 94 },
                2: { cellWidth: 40 },
                3: { cellWidth: 40 },
              },
              tableWidth: 220,
              margin: { left: 10, right: 10, top: 3 },
            });

            // Convertir el PDF a Blob
            const pdfBlob = pdf.output('blob');

            try {
              // Subir el Blob a Firebase Storage
              const filename = `recibo_pago_${studentInfo.carnet}.pdf`;
              const downloadURL = await firebaseSvc.uploadPdfToStorage(pdfBlob, filename);

              // Resolver la promesa con la URL de descarga
              resolve(downloadURL);
            } catch (error) {
              console.error('Error al subir el PDF a Firebase:', error);
              reject(error);
            }
          },
        });
      });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw new Error('No se pudo generar el PDF');
    }
  };

  return { generarPdf };
}
