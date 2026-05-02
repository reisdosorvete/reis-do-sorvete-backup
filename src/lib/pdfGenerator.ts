import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, STORE_NAMES } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency, formatNumber } from '@/lib/utils';

import eskimoLogoRed from '@/assets/eskimo-logo-red.png';
import eskimoVerao from '@/assets/eskimo-verao.png';

export interface PDFHeaderData {
  companyName: string;
  cnpj: string;
  ie: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  cep: string;
  discount: number;
  paymentMethod: string;
}

export function generateOrderPDF(order: Order, headerData: PDFHeaderData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const discount = headerData.discount / 100;
  const redColor: [number, number, number] = [220, 38, 38];

  try {
    doc.addImage(eskimoLogoRed, 'PNG', 14, 8, 50, 22);
    doc.addImage(eskimoVerao, 'PNG', pageWidth - 44, 8, 30, 22);
  } catch (e) {
    console.warn('Erro ao carregar imagens no PDF, continuando sem elas.');
  }

  // Cabeçalho - Dados da Empresa
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(redColor[0], redColor[1], redColor[2]);
  doc.text(headerData.companyName, 14, 42);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  let currentY = 49;
  doc.text(`CNPJ: ${headerData.cnpj} ${headerData.ie ? ' | IE: ' + headerData.ie : ''}`, 14, currentY);
  currentY += 5;
  
  if (headerData.phone || headerData.email) {
    doc.text(`${headerData.phone} ${headerData.email ? ' | ' + headerData.email : ''}`, 14, currentY);
    currentY += 5;
  }
  
  if (headerData.address) {
    doc.text(`${headerData.address} - ${headerData.city} CEP: ${headerData.cep}`, 14, currentY);
  }

  // Info do Pedido à Direita
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(redColor[0], redColor[1], redColor[2]);
  doc.text('PEDIDO DE COMPRA', pageWidth - 14, 45, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const dateStr = format(new Date(order.createdAt), "dd/MM/yyyy", { locale: ptBR });
  doc.text(`Data: ${dateStr}`, pageWidth - 14, 54, { align: 'right' });
  doc.text(`Loja: ${STORE_NAMES[order.store]}`, pageWidth - 14, 62, { align: 'right' });

  // Tabela de Produtos
  const tableData = order.items.map(item => [
    item.productCode || '-',
    item.productName,
    (item.isCrate && item.crates > 0) ? formatNumber(item.crates) : '-',
    item.boxes > 0 ? formatNumber(item.boxes) : '-',
    (item.looseUnits || 0) > 0 ? formatNumber(item.looseUnits) : '-',
    formatNumber(item.totalUnits),
    formatCurrency(item.totalUnits * item.unitPrice),
  ]);

  // Cálculos de Totais
  const subtotal = order.items.reduce((sum, item) => sum + (item.totalUnits * item.unitPrice), 0);
  const totalWithDiscount = subtotal * (1 - discount);

  tableData.push(['', 'SUBTOTAL', '', '', '', '', formatCurrency(subtotal)]);
  tableData.push(['', `TOTAL (${headerData.discount}% desconto)`, '', '', '', '', formatCurrency(totalWithDiscount)]);

  autoTable(doc, {
    startY: 85,
    head: [['CÓDIGO', 'PRODUTO', 'ENGR.', 'CAIXAS', 'AVULSO', 'TOTAL UN', 'VALOR']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: redColor, textColor: 255, fontSize: 7, halign: 'center' },
    styles: { fontSize: 7, cellPadding: 2 },
    didParseCell: (data) => {
      if (data.row.index >= tableData.length - 2) {
        data.cell.styles.fontStyle = 'bold';
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fillColor = [220, 252, 231];
          data.cell.styles.textColor = [22, 163, 74];
        }
      }
    }
  });

  // Assinatura
  const finalY = (doc as any).lastAutoTable.finalY + 30;
  doc.setDrawColor(0);
  doc.line(pageWidth / 2 - 40, finalY, pageWidth / 2 + 40, finalY);
  doc.setFontSize(8);
  doc.text('Assinatura do Responsável', pageWidth / 2, finalY + 5, { align: 'center' });

  doc.save(`Pedido_${STORE_NAMES[order.store]}_${dateStr}.pdf`);
}