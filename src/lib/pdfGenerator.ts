import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, STORE_NAMES } from '@/types';
import { formatCurrency } from '@/lib/utils';

// Função segura para formatar números diretamente aqui (evita falhas de importação)
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('pt-BR').format(num || 0);
};

export const generateOrderPDF = (order: Order) => {
  // Inicializa o documento de forma segura
  const doc = new jsPDF();
  
  // Tratamento seguro de datas
  const dateObj = new Date(order.createdAt || Date.now());
  const date = dateObj.toLocaleDateString('pt-BR');
  const time = dateObj.toLocaleTimeString('pt-BR');

  // Cabeçalho do PDF
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text('REIS DO SORVETE', 14, 22);

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text(`Pedido #${(order.id || '').slice(0, 8).toUpperCase()}`, 14, 30);
  doc.text(`Loja: ${STORE_NAMES[order.store] || 'Não informada'}`, 14, 36);
  doc.text(`Data: ${date} às ${time}`, 14, 42);
  doc.text(`Operador: ${order.createdBy || 'Sistema'}`, 14, 48);

  // Preparando os dados da Tabela
  const tableColumn = ["#", "CÓDIGO", "PRODUTO", "ENG", "CX", "AVULSO", "TOTAL UN", "VALOR"];
  const tableRows: any[] = [];

  let subtotal = 0;
  let totalCrates = 0;
  let totalBoxes = 0;
  let totalLoose = 0;
  let totalUnits = 0;

  // Garante que items é um array válido
  const items = order.items || [];

  items.forEach((item, index) => {
    const itemTotal = (item.totalUnits || 0) * (item.unitPrice || 0);
    subtotal += itemTotal;
    totalCrates += item.crates || 0;
    totalBoxes += item.boxes || 0;
    totalLoose += item.looseUnits || 0;
    totalUnits += item.totalUnits || 0;

    tableRows.push([
      index + 1,
      item.productCode || '-',
      item.productName || 'Produto sem nome',
      item.crates > 0 ? item.crates : '-',
      item.boxes > 0 ? item.boxes : '-',
      item.looseUnits > 0 ? item.looseUnits : '-',
      formatNumber(item.totalUnits),
      formatCurrency(itemTotal)
    ]);
  });

  // Linha de Subtotal
  tableRows.push([
    '', '', 'SUBTOTAL',
    totalCrates > 0 ? totalCrates : '-',
    totalBoxes > 0 ? totalBoxes : '-',
    totalLoose > 0 ? totalLoose : '-',
    formatNumber(totalUnits),
    formatCurrency(subtotal)
  ]);

  // Renderiza a Tabela
  autoTable(doc, {
    startY: 55,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { 
      fillColor: [59, 130, 246], // Azul da marca
      textColor: 255, 
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'left' },
      3: { halign: 'center', cellWidth: 15 },
      4: { halign: 'center', cellWidth: 15 },
      5: { halign: 'center', cellWidth: 18 },
      6: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
      7: { halign: 'right', cellWidth: 30, fontStyle: 'bold' }
    },
    willDrawCell: function(data) {
      // Pinta a linha de SUBTOTAL de cinza clarinho
      if (data.row.raw[2] === 'SUBTOTAL') {
        data.cell.styles.fillColor = [241, 245, 249];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // Salva o arquivo com o nome formatado
  const storeName = STORE_NAMES[order.store] || 'Loja';
  doc.save(`Pedido_${storeName}_${date.replace(/\//g, '-')}.pdf`);
};