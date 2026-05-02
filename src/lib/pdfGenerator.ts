import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, STORE_NAMES } from '@/types';
import { formatCurrency } from '@/lib/utils';
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

// Função segura para formatar números
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('pt-BR').format(num || 0);
};

export const generateOrderPDF = (order: Order, headerData: PDFHeaderData) => {
  // Inicializa o documento de forma segura
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const discount = (headerData?.discount || 0) / 100;
  
  // Cor vermelha da Eskimó
  const redColor: [number, number, number] = [220, 38, 38];
  
  // Imagem Logo Esquerda
  try {
    doc.addImage(eskimoLogoRed, 'PNG', 14, 8, 50, 22);
  } catch (e) {
    console.log('Error loading logo:', e);
  }
  
  // Imagem "É Verão o Ano Todo" Direita
  try {
    doc.addImage(eskimoVerao, 'PNG', pageWidth - 44, 8, 30, 22);
  } catch (e) {
    console.log('Error loading verao image:', e);
  }
  
  // Cabeçalho - Informações da Empresa
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(redColor[0], redColor[1], redColor[2]);
  doc.text(headerData?.companyName || 'REIS DO SORVETE', 14, 42);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  let currentY = 49;
  const lineHeight = 5;
  
  // CNPJ & IE
  doc.setFont('helvetica', 'bold');
  const cnpjLabel = 'CNPJ: ';
  doc.text(cnpjLabel, 14, currentY);
  const cnpjLabelW = doc.getTextWidth(cnpjLabel);
  doc.setFont('helvetica', 'normal');
  const cnpjVal = headerData?.cnpj || '';
  doc.text(cnpjVal, 14 + cnpjLabelW, currentY);
  
  if (headerData?.ie) {
    const cnpjFullW = cnpjLabelW + doc.getTextWidth(cnpjVal);
    doc.setFont('helvetica', 'normal');
    doc.text(' | ', 14 + cnpjFullW, currentY);
    const sepW = doc.getTextWidth(' | ');
    doc.setFont('helvetica', 'bold');
    const ieLabel = 'IE: ';
    doc.text(ieLabel, 14 + cnpjFullW + sepW, currentY);
    const ieLabelW = doc.getTextWidth(ieLabel);
    doc.setFont('helvetica', 'normal');
    doc.text(headerData.ie, 14 + cnpjFullW + sepW + ieLabelW, currentY);
  }
  currentY += lineHeight;
  
  // Contatos
  const infoParts: string[] = [];
  if (headerData?.phone) infoParts.push(`Fone: ${headerData.phone}`);
  if (headerData?.email) infoParts.push(headerData.email);
  if (infoParts.length > 0) {
    doc.text(infoParts.join(' | '), 14, currentY);
    currentY += lineHeight;
  }
  
  // Endereço
  const addressParts: string[] = [];
  if (headerData?.address) addressParts.push(headerData.address);
  if (headerData?.city) addressParts.push(headerData.city);
  if (headerData?.cep) addressParts.push(`CEP: ${headerData.cep}`);
  if (addressParts.length > 0) {
    doc.text(addressParts.join(' - '), 14, currentY);
  }
  
  // Informações do Pedido (Alinhado à Direita)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(redColor[0], redColor[1], redColor[2]);
  doc.text('PEDIDO DE COMPRA', pageWidth - 14, 45, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const rightMargin = pageWidth - 14;

  const dateObj = new Date(order.createdAt || Date.now());
  const dateStr = dateObj.toLocaleDateString('pt-BR');
  
  doc.setFont('helvetica', 'normal');
  const dateValWidth = doc.getTextWidth(dateStr);
  doc.setFont('helvetica', 'bold');
  const dateLblWidth = doc.getTextWidth('Data: ');
  const dateStartX = rightMargin - dateValWidth - dateLblWidth;
  doc.text('Data: ', dateStartX, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, dateStartX + dateLblWidth, 54);

  const storeStr = STORE_NAMES[order.store] || 'Loja';
  doc.setFont('helvetica', 'normal');
  const storeValWidth = doc.getTextWidth(storeStr);
  doc.setFont('helvetica', 'bold');
  const storeLblWidth = doc.getTextWidth('Loja: ');
  const storeStartX = rightMargin - storeValWidth - storeLblWidth;
  doc.text('Loja: ', storeStartX, 62);
  doc.setFont('helvetica', 'normal');
  doc.text(storeStr, storeStartX + storeLblWidth, 62);
  
  // Linha Separadora Vermelha
  doc.setDrawColor(redColor[0], redColor[1], redColor[2]);
  doc.setLineWidth(0.5);
  doc.line(14, 85, pageWidth - 14, 85);
  
  // Preparando os dados da Tabela
  const tableData: any[] = [];
  let subtotal = 0;
  let totalCrates = 0;
  let totalBoxes = 0;
  let totalLoose = 0;
  let totalUnits = 0;

  const items = order.items || [];

  items.forEach(item => {
    const itemTotal = (item.totalUnits || 0) * (item.unitPrice || 0);
    const loose = item.looseUnits || 0;
    
    subtotal += itemTotal;
    totalCrates += item.crates || 0;
    totalBoxes += item.boxes || 0;
    totalLoose += loose;
    totalUnits += item.totalUnits || 0;

    tableData.push([
      item.productCode || '-',
      item.productName || 'Produto',
      item.crates > 0 ? formatNumber(item.crates) : '-',
      item.boxes > 0 ? formatNumber(item.boxes) : '-',
      loose > 0 ? formatNumber(loose) : '-',
      formatNumber(item.totalUnits),
      formatCurrency(itemTotal)
    ]);
  });
  
  const totalWithDiscount = subtotal * (1 - discount);
  
  // Linha de Subtotal
  tableData.push([
    '',
    'SUBTOTAL',
    totalCrates > 0 ? formatNumber(totalCrates) : '-',
    totalBoxes > 0 ? formatNumber(totalBoxes) : '-',
    totalLoose > 0 ? formatNumber(totalLoose) : '-',
    formatNumber(totalUnits),
    formatCurrency(subtotal)
  ]);
  
  // Linha de Total com Desconto
  tableData.push([
    '',
    `TOTAL (${headerData?.discount || 0}% desconto)`,
    '', '', '', '',
    formatCurrency(totalWithDiscount)
  ]);
  
  // Renderiza Tabela com autoTable
  autoTable(doc, {
    startY: 92,
    head: [['CÓDIGO', 'PRODUTO', 'ENGRADADOS', 'CAIXAS', 'AVULSO', 'TOTAL UN', 'VALOR']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: redColor,
      textColor: 255,
      fontSize: 6,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 1.5,
      valign: 'middle',
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 2,
      textColor: [50, 50, 50],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      1: { halign: 'left', cellWidth: 'auto' },
      2: { halign: 'center', cellWidth: 18 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'center', cellWidth: 14 },
      5: { halign: 'center', cellWidth: 16 },
      6: { halign: 'right', cellWidth: 24, cellPadding: { top: 2, bottom: 2, left: 2, right: 5 } },
    },
    willDrawCell: function(data) {
      if (data.row.index === tableData.length - 2) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [245, 245, 245];
      }
      if (data.row.index === tableData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [220, 252, 231];
        data.cell.styles.textColor = [22, 163, 74];
      }
    },
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  doc.setFont('helvetica', 'bold');
  const discountLabel = 'Desconto Aplicado:';
  doc.text(discountLabel, 14, finalY + 10);
  const discountLabelWidth = doc.getTextWidth(discountLabel);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${(headerData?.discount || 0).toFixed(0)}%`, 14 + discountLabelWidth, finalY + 10);
  
  doc.setFont('helvetica', 'bold');
  const paymentLabel = 'Forma de Pagamento:';
  doc.text(paymentLabel, 14, finalY + 16);
  const paymentLabelWidth = doc.getTextWidth(paymentLabel);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${headerData?.paymentMethod || 'A Combinar'}`, 14 + paymentLabelWidth, finalY + 16);
  
  // Linha de Assinatura
  const signatureY = finalY + 35;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  const lineStart = pageWidth / 2 - 40;
  const lineEnd = pageWidth / 2 + 40;
  doc.line(lineStart, signatureY, lineEnd, signatureY);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Responsável pelo Pedido', pageWidth / 2, signatureY + 5, { align: 'center' });
  
  // Salvar PDF
  const fileName = `Pedido_${storeStr}_${dateStr.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}