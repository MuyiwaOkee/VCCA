import { jsPDF } from 'jspdf';

const dateString = new Date().toISOString().split('T')[0];

export const downloadTextAsPdf = (text: string, filename: string = `report-${dateString}.pdf`,  options = {
    fontSize: 12,
    margin: 20,
    lineHeight: 1.2
  }) => {
    const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Calculate available width (subtract left and right margins)
  const textWidth = pageWidth - options.margin * 2;
  
  // Set initial position
  let yPosition = options.margin;
  
  // Split text into lines that fit the page width
  const lines = doc.splitTextToSize(text, textWidth);
  
  // Set font
  doc.setFontSize(options.fontSize);
  
  for (let i = 0; i < lines.length; i++) {
    // Check if we need a new page (current position + line height exceeds page height)
    if (yPosition > pageHeight - options.margin) {
      doc.addPage();
      yPosition = options.margin; // Reset to top of new page
    }
    
    // Add the line
    doc.text(lines[i], options.margin, yPosition);
    
    // Move to next line position
    yPosition += options.fontSize * options.lineHeight;
  }
  
  // Save the PDF
  doc.save(filename);
}