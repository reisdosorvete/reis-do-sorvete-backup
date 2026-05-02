import { Product, User, Order, Store } from '@/types';

// Produtos baseados na planilha Eskimo - apenas produtos com preço ativo
// unitsPerBox = QTD. UN. (CAIXA) - quantidade de unidades por caixa
// unitsPerCrate = CONGIF. ENG - quantidade de unidades por engradado
// boxesPerCrate = unitsPerCrate / unitsPerBox - caixas por engradado

export const mockProducts: Product[] = [
  // ========================
  // SUNDAE
  // ========================
  { id: '1', name: 'SUNDAE BAUNILHA COM CHOCOTELLA', code: '36452', category: 'sorvete-sundae', unitsPerBox: 2, unitsPerCrate: 56, boxesPerCrate: 28, unitPrice: 6.75, active: true, createdAt: new Date() },
  { id: '2', name: 'SUNDAE FRUTA DO BOSQUE', code: '24009', category: 'sorvete-sundae', unitsPerBox: 2, unitsPerCrate: 56, boxesPerCrate: 28, unitPrice: 6.75, active: true, createdAt: new Date() },
  
  // ========================
  // NAPOLICUP
  // ========================
  { id: '3', name: 'NAPOLICUP 250ML', code: '9070', category: 'sorvete-napolicup', unitsPerBox: 1, unitsPerCrate: 60, boxesPerCrate: 60, unitPrice: 6.75, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ FRUTA
  // ========================
  { id: '4', name: 'PICOLÉ FRUTA ABACAXI', code: '24017', category: 'picole-fruta', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  { id: '5', name: 'PICOLÉ FRUTA FRAMBOESA', code: '24019', category: 'picole-fruta', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  { id: '6', name: 'PICOLÉ FRUTA LIMÃO', code: '24021', category: 'picole-fruta', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  { id: '7', name: 'PICOLÉ FRUTA MINI-SAIA', code: '24022', category: 'picole-fruta', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  { id: '8', name: 'PICOLÉ FRUTA UVA', code: '24023', category: 'picole-fruta', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  { id: '9', name: 'PICOLÉ FRUTA ÁGUA DE COCO', code: '35252', category: 'picole-fruta', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  { id: '10', name: 'PICOLÉ FRUTA MORANGO', code: '43340', category: 'picole-fruta', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  { id: '11', name: 'PICOLÉ FRUTA MARACUJA', code: '43341', category: 'picole-fruta', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ CREME
  // ========================
  { id: '12', name: 'PICOLÉ CREME CHOCOLATE', code: '24033', category: 'picole-creme', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '13', name: 'PICOLÉ CREME COCO BRANCO', code: '24034', category: 'picole-creme', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '14', name: 'PICOLÉ CREME MILHO VERDE', code: '24035', category: 'picole-creme', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '15', name: 'PICOLÉ CREME MORANGO', code: '24036', category: 'picole-creme', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '16', name: 'PICOLÉ CREME LEITE CONDENSADO', code: '24037', category: 'picole-creme', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '17', name: 'PICOLÉ CREME NATA', code: '36972', category: 'picole-creme', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '18', name: 'PICOLÉ CREME DOCE LEITE', code: '41784', category: 'picole-creme', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.50, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ CREME SPECIALE
  // ========================
  { id: '19', name: 'PICOLÉ CREME SPECIALE CHOCOLATE', code: '24043', category: 'picole-creme-speciale', unitsPerBox: 30, unitsPerCrate: 180, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ CHOCOTINE
  // ========================
  { id: '20', name: 'PICOLÉ CHOCOTINE', code: '44899', category: 'picole-chocotine', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 6.50, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ SUPER BARRITA
  // ========================
  { id: '21', name: 'PICOLÉ SUPER BARRITA', code: '8803', category: 'picole-super-barrita', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 6.50, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ BOMBOM
  // ========================
  { id: '22', name: 'PICOLÉ BOMBOM BRIGADEIRO', code: '24047', category: 'picole-bombom', unitsPerBox: 33, unitsPerCrate: 198, boxesPerCrate: 6, unitPrice: 5.50, active: true, createdAt: new Date() },
  { id: '23', name: 'PICOLÉ BOMBOM SKIMO', code: '24048', category: 'picole-bombom', unitsPerBox: 33, unitsPerCrate: 198, boxesPerCrate: 6, unitPrice: 5.50, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ MOCAFFE
  // ========================
  { id: '24', name: 'PICOLÉ MOCAFFE', code: '8003', category: 'picole-la-sobremesa', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 6.50, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ GREGO
  // ========================
  { id: '25', name: 'PICOLÉ GREGO FRUTAS VERMELHAS', code: '24052', category: 'picole-grego', unitsPerBox: 30, unitsPerCrate: 180, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ PICOLÁPIS
  // ========================
  { id: '26', name: 'PICOLÉ PICOLÁPIS SURPRESA', code: '30749', category: 'picole-kids', unitsPerBox: 50, unitsPerCrate: 300, boxesPerCrate: 6, unitPrice: 1.50, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ LINHA MAIS
  // ========================
  { id: '27', name: 'PICOLÉ MAIS COCO', code: '24058', category: 'picole-linha-mais', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  { id: '28', name: 'PICOLÉ MAIS PACOCA', code: '24059', category: 'picole-linha-mais', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  { id: '29', name: 'PICOLÉ COCO QUEIMADO', code: '40042', category: 'picole-linha-mais', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ DIAMOND
  // ========================
  { id: '30', name: 'PICOLÉ DIAMOND CHOCOMALT', code: '24067', category: 'picole-diamond', unitsPerBox: 26, unitsPerCrate: 156, boxesPerCrate: 6, unitPrice: 5.50, active: true, createdAt: new Date() },
  { id: '31', name: 'PICOLÉ DIAMOND COOKIES BIANCO', code: '24069', category: 'picole-diamond', unitsPerBox: 26, unitsPerCrate: 156, boxesPerCrate: 6, unitPrice: 5.50, active: true, createdAt: new Date() },
  { id: '32', name: 'PICOLÉ DIAMOND COOKIES', code: '24068', category: 'picole-diamond', unitsPerBox: 26, unitsPerCrate: 156, boxesPerCrate: 6, unitPrice: 5.50, active: true, createdAt: new Date() },
  { id: '33', name: 'PICOLÉ DIAMOND FRUTAS VERMELHAS', code: '41604', category: 'picole-diamond', unitsPerBox: 26, unitsPerCrate: 156, boxesPerCrate: 6, unitPrice: 5.50, active: true, createdAt: new Date() },
  { id: '34', name: 'PICOLÉ DIAMOND PISTACHE', code: '41603', category: 'picole-diamond', unitsPerBox: 26, unitsPerCrate: 156, boxesPerCrate: 6, unitPrice: 5.50, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ ITUZINHO
  // ========================
  { id: '35', name: 'PICOLÉ ITUZINHO CHICLETES', code: '24091', category: 'picole-ituzinho', unitsPerBox: 30, unitsPerCrate: 180, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  { id: '36', name: 'PICOLÉ ITUZINHO LEITINHO TRUFADO', code: '24092', category: 'picole-ituzinho', unitsPerBox: 30, unitsPerCrate: 180, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  { id: '37', name: 'PICOLÉ ITUZINHO MOUSSE DE MARACUJA', code: '24093', category: 'picole-ituzinho', unitsPerBox: 30, unitsPerCrate: 180, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  
  // ========================
  // COPINHO GOURMET
  // ========================
  { id: '38', name: 'COPINHO GOURMET BOMBOM DE COCO 150ML', code: '24099', category: 'sorvete-copinho-gourmet', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '39', name: 'COPINHO GOURMET CARAM SALG & COOKIES 150ML', code: '24100', category: 'sorvete-copinho-gourmet', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '40', name: 'COPINHO GOURMET MORAN. AO LEIT. 150ML', code: '24102', category: 'sorvete-copinho-gourmet', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '41', name: 'COPINHO GOURMET TORTA DE LIMÃO 150ML', code: '24103', category: 'sorvete-copinho-gourmet', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 4.50, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ LOS PALITOS MEXICANOS
  // ========================
  { id: '42', name: 'PICOLÉ MEX. MARACUJA C/LEITE COND', code: '24081', category: 'picole-los-palitos', unitsPerBox: 30, unitsPerCrate: 180, boxesPerCrate: 6, unitPrice: 6.50, active: true, createdAt: new Date() },
  { id: '43', name: 'PICOLÉ MEX. MORANGO C/LEITE COND', code: '24082', category: 'picole-los-palitos', unitsPerBox: 30, unitsPerCrate: 180, boxesPerCrate: 6, unitPrice: 6.50, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ LA SOBREMESA
  // ========================
  { id: '44', name: 'PICOLÉ LA SOBREMESA LIMONADA SUICA', code: '43338', category: 'picole-la-sobremesa', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '45', name: 'PICOLÉ LA SOBREMESA QUATRO LEITES COM AMARENA', code: '29925', category: 'picole-la-sobremesa', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '46', name: 'PICOLÉ LA SOBREMESA SAGU', code: '29926', category: 'picole-la-sobremesa', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '47', name: 'PICOLÉ LA SOBREMESA PUDIM DE LEITE', code: '37488', category: 'picole-la-sobremesa', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '48', name: 'PICOLÉ LA SOBREMESA ROMEU & JULIETA', code: '37489', category: 'picole-la-sobremesa', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 4.50, active: true, createdAt: new Date() },
  
  // ========================
  // TORTA DE SORVETE
  // ========================
  { id: '49', name: 'TORTA DE SORVETE IOGURTE GREGO C/MORANGO', code: '24165', category: 'sorvete-torta', unitsPerBox: 1, unitsPerCrate: 6, boxesPerCrate: 6, unitPrice: 29.00, active: true, createdAt: new Date() },
  { id: '50', name: 'TORTA DE SORVETE ABACAXI C/COCO', code: '24164', category: 'sorvete-torta', unitsPerBox: 1, unitsPerCrate: 6, boxesPerCrate: 6, unitPrice: 29.00, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ KIDS
  // ========================
  { id: '51', name: 'PICOLÉ KIDS UNICÓRNIO', code: '24112', category: 'picole-kids', unitsPerBox: 20, unitsPerCrate: 120, boxesPerCrate: 6, unitPrice: 5.00, active: true, createdAt: new Date() },
  { id: '52', name: 'PICOLÉ BOB ESPONJA', code: '39522', category: 'picole-kids', unitsPerBox: 20, unitsPerCrate: 120, boxesPerCrate: 6, unitPrice: 5.00, active: true, createdAt: new Date() },
  { id: '53', name: 'PICOLÉ PATRICK', code: '39523', category: 'picole-kids', unitsPerBox: 20, unitsPerCrate: 120, boxesPerCrate: 6, unitPrice: 5.00, active: true, createdAt: new Date() },
  
  // ========================
  // PICOLÉ ZERO
  // ========================
  { id: '54', name: 'PICOLÉ ZERO AÇUCAR CHOCOLATE', code: '24121', category: 'picole-zero', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  { id: '55', name: 'PICOLÉ ZERO AÇUCAR COCO', code: '24122', category: 'picole-zero', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  
  // ========================
  // CONE SELETTO
  // ========================
  { id: '56', name: 'CONE SELETTO BRIGADEIRO', code: '24125', category: 'picole-seletto', unitsPerBox: 4, unitsPerCrate: 112, boxesPerCrate: 28, unitPrice: 7.50, active: true, createdAt: new Date() },
  { id: '57', name: 'CONE SELETTO CROCANTE', code: '24126', category: 'picole-seletto', unitsPerBox: 4, unitsPerCrate: 112, boxesPerCrate: 28, unitPrice: 7.50, active: true, createdAt: new Date() },
  { id: '58', name: 'CONE SELETTO NA CAIXINHA PISTACHE', code: '44391', category: 'picole-seletto', unitsPerBox: 4, unitsPerCrate: 112, boxesPerCrate: 28, unitPrice: 7.50, active: true, createdAt: new Date() },
  
  // ========================
  // POTE 2L
  // ========================
  { id: '59', name: 'POTE SORVETE 2L CAPPUCCINO', code: '44897', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '60', name: 'POTE SORVETE 2L CROCANTE', code: '42699', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '61', name: 'POTE 2L ABACAXI COM COCO', code: '24129', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '62', name: 'POTE 2L BANANA COM CHOCOTELA', code: '24130', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '63', name: 'POTE 2L BRIGADEIRO', code: '24131', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '64', name: 'POTE 2L CHOCOLAK', code: '24141', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '65', name: 'POTE 2L CHOCOLATE BRANCO', code: '24142', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 19.75, active: true, createdAt: new Date() },
  { id: '66', name: 'POTE 2L CHOCOMENTA XADREZ', code: '24157', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '67', name: 'POTE 2L COCO + MILHO VERDE', code: '24151', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 19.75, active: true, createdAt: new Date() },
  { id: '68', name: 'POTE 2L CREME', code: '24150', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '69', name: 'POTE 2L CREME + FLOCOS + CHOCOLATE', code: '27176', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '70', name: 'POTE 2L FLOCOS', code: '24143', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '71', name: 'POTE 2L LEITE COND + CHOCOLATE', code: '24152', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '72', name: 'POTE 2L LEITINHO TRUFADO', code: '24144', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '73', name: 'POTE 2L MARTA ROCHA', code: '24145', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '74', name: 'POTE 2L MORANGO', code: '24146', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 19.75, active: true, createdAt: new Date() },
  { id: '75', name: 'POTE 2L NAPOLITANO', code: '24147', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '76', name: 'POTE 2L NATA + UVA', code: '24153', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 19.75, active: true, createdAt: new Date() },
  { id: '77', name: 'POTE 2L TRAMONTARO', code: '24148', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '78', name: 'POTE 2L TRUFA', code: '24149', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '79', name: 'POTE 2L PASSAS AO RUM', code: '24155', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '80', name: 'POTE 2L CHOCOCO', code: '36448', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '81', name: 'POTE 2L CEREJA E AMARENA', code: '44203', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '82', name: 'POTE 2L MOUSSE DE MARACUJA TRUFADO', code: '44397', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  { id: '83', name: 'POTE 2L SENSAZIONE', code: '44395', category: 'sorvete-pote-2l', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 26.50, active: true, createdAt: new Date() },
  
  // ========================
  // POTE DIET 1L
  // ========================
  { id: '84', name: 'POTE DIET 1L BEIJINHO SÍRIO', code: '24162', category: 'sorvete-zero', unitsPerBox: 1, unitsPerCrate: 32, boxesPerCrate: 32, unitPrice: 22.50, active: true, createdAt: new Date() },
  { id: '85', name: 'POTE DIET 1L FRUTAS VERMELHAS', code: '24163', category: 'sorvete-zero', unitsPerBox: 1, unitsPerCrate: 32, boxesPerCrate: 32, unitPrice: 22.50, active: true, createdAt: new Date() },
  
  // ========================
  // POTE NEVADO 1,5L
  // ========================
  { id: '86', name: 'POTE NEVADO 1,5L BANOFFEE', code: '43335', category: 'sorvete-grand-nevado', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 22.50, active: true, createdAt: new Date() },
  { id: '87', name: 'POTE NEVADO 1,5L YOG. GREGO C/AMORA', code: '24168', category: 'sorvete-grand-nevado', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 22.50, active: true, createdAt: new Date() },
  { id: '88', name: 'POTE NEVADO 1,5L NATA TRUFADA', code: '24169', category: 'sorvete-grand-nevado', unitsPerBox: 1, unitsPerCrate: 16, boxesPerCrate: 16, unitPrice: 22.50, active: true, createdAt: new Date() },
  
  // ========================
  // BEST CUP 750ML
  // ========================
  { id: '89', name: 'BEST CUP 750ML CHOCOLATE DUBAI', code: '44204', category: 'sorvete-best-cup', unitsPerBox: 1, unitsPerCrate: 24, boxesPerCrate: 24, unitPrice: 19.50, active: true, createdAt: new Date() },
  { id: '90', name: 'BEST CUP 750ML ABACAXI AO VINHO', code: '26259', category: 'sorvete-best-cup', unitsPerBox: 1, unitsPerCrate: 24, boxesPerCrate: 24, unitPrice: 19.50, active: true, createdAt: new Date() },
  { id: '91', name: 'BEST CUP 750ML DOCE DE LEITE', code: '26552', category: 'sorvete-best-cup', unitsPerBox: 1, unitsPerCrate: 24, boxesPerCrate: 24, unitPrice: 19.50, active: true, createdAt: new Date() },
  { id: '92', name: 'BEST CUP 750ML FLORESTA NEGRA', code: '26262', category: 'sorvete-best-cup', unitsPerBox: 1, unitsPerCrate: 24, boxesPerCrate: 24, unitPrice: 19.50, active: true, createdAt: new Date() },
  { id: '93', name: 'BEST CUP 750ML PISTACHE', code: '26261', category: 'sorvete-best-cup', unitsPerBox: 1, unitsPerCrate: 24, boxesPerCrate: 24, unitPrice: 19.50, active: true, createdAt: new Date() },
  { id: '94', name: 'BEST CUP 750ML CHOCOMALT', code: '30771', category: 'sorvete-best-cup', unitsPerBox: 1, unitsPerCrate: 24, boxesPerCrate: 24, unitPrice: 19.50, active: true, createdAt: new Date() },
  { id: '95', name: 'BEST CUP 750ML MIL FOLHAS', code: '36902', category: 'sorvete-best-cup', unitsPerBox: 1, unitsPerCrate: 24, boxesPerCrate: 24, unitPrice: 19.50, active: true, createdAt: new Date() },
  { id: '96', name: 'BEST CUP 750ML CHOCODULCE', code: '36903', category: 'sorvete-best-cup', unitsPerBox: 1, unitsPerCrate: 24, boxesPerCrate: 24, unitPrice: 19.50, active: true, createdAt: new Date() },
  
  // ========================
  // AÇAÍ
  // ========================
  { id: '97', name: 'AÇAÍ 180G ANGA C/ BANANA', code: '41665', category: 'acai', unitsPerBox: 1, unitsPerCrate: 63, boxesPerCrate: 63, unitPrice: 12.00, active: true, createdAt: new Date() },
  { id: '98', name: 'AÇAÍ 180G ANGA C/ GUARANA', code: '41629', category: 'acai', unitsPerBox: 1, unitsPerCrate: 63, boxesPerCrate: 63, unitPrice: 12.00, active: true, createdAt: new Date() },
  { id: '99', name: 'AÇAÍ 1L C/ GUARANA', code: '30998', category: 'acai', unitsPerBox: 1, unitsPerCrate: 32, boxesPerCrate: 32, unitPrice: 29.00, active: true, createdAt: new Date() },
  { id: '100', name: 'AÇAÍ 1L C/ BANANA', code: '30999', category: 'acai', unitsPerBox: 1, unitsPerCrate: 32, boxesPerCrate: 32, unitPrice: 29.00, active: true, createdAt: new Date() },
  
  // ========================
  // TURMA DA MONICA
  // ========================
  { id: '101', name: 'PICOLÉ TURMA DA MONICA MORANGO', code: '42076', category: 'picole-kids', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  { id: '102', name: 'PICOLÉ TURMA DA MONICA MAÇÃ-VERDE', code: '42077', category: 'picole-kids', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  { id: '103', name: 'PICOLÉ TURMA DA MONICA TUTTI-FRUTTI', code: '42078', category: 'picole-kids', unitsPerBox: 45, unitsPerCrate: 270, boxesPerCrate: 6, unitPrice: 2.00, active: true, createdAt: new Date() },
  
  // ========================
  // NOVOS PRODUTOS (conforme tabela)
  // ========================
  { id: '104', name: 'PICOLÉ BARRITA', code: '8802', category: 'picole-barrita', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 6.50, active: true, createdAt: new Date() },
  { id: '105', name: 'PICOLÉ ITUZINHO CHICLETES', code: '24090', category: 'picole-ituzinho', unitsPerBox: 30, unitsPerCrate: 180, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  { id: '106', name: 'PICOLÉ ITUZINHO LEITINHO TRUFADO', code: '24085', category: 'picole-ituzinho', unitsPerBox: 30, unitsPerCrate: 180, boxesPerCrate: 6, unitPrice: 3.75, active: true, createdAt: new Date() },
  { id: '107', name: 'PICOLÉ LA SOBREMESA CHURROS', code: '29927', category: 'picole-la-sobremesa', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '108', name: 'PICOLÉ LA SOBREMESA TORTA DE LIMÃO', code: '37490', category: 'picole-la-sobremesa', unitsPerBox: 38, unitsPerCrate: 228, boxesPerCrate: 6, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '109', name: 'COPINHO GOURMET PISTACHE 150ML', code: '24109', category: 'sorvete-copinho-gourmet', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '110', name: 'COPINHO GOURMET NINHO TRUFADO 150ML', code: '24111', category: 'sorvete-copinho-gourmet', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 4.50, active: true, createdAt: new Date() },
  { id: '111', name: 'CONE SELETTO CROCANTE', code: '24126', category: 'picole-seletto', unitsPerBox: 4, unitsPerCrate: 112, boxesPerCrate: 28, unitPrice: 7.50, active: true, createdAt: new Date() },
  { id: '112', name: 'PICOLÉ KIDS DINOSSAURO', code: '37904', category: 'picole-kids', unitsPerBox: 20, unitsPerCrate: 120, boxesPerCrate: 6, unitPrice: 5.00, active: true, createdAt: new Date() },
  { id: '113', name: 'PICOLÉ KIDS GATINHO', code: '37905', category: 'picole-kids', unitsPerBox: 20, unitsPerCrate: 120, boxesPerCrate: 6, unitPrice: 5.00, active: true, createdAt: new Date() },
  { id: '114', name: 'PICOLÉ KIDS BALEIA', code: '37906', category: 'picole-kids', unitsPerBox: 20, unitsPerCrate: 120, boxesPerCrate: 6, unitPrice: 5.00, active: true, createdAt: new Date() },
  { id: '115', name: 'PICOLÉ KIDS CACHORRINHO', code: '37907', category: 'picole-kids', unitsPerBox: 20, unitsPerCrate: 120, boxesPerCrate: 6, unitPrice: 5.00, active: true, createdAt: new Date() },
  { id: '116', name: 'PICOLÉ KIDS TUBARÃO', code: '37908', category: 'picole-kids', unitsPerBox: 20, unitsPerCrate: 120, boxesPerCrate: 6, unitPrice: 5.00, active: true, createdAt: new Date() },
  { id: '117', name: 'PICOLÉ KIDS COELHINHO', code: '37909', category: 'picole-kids', unitsPerBox: 20, unitsPerCrate: 120, boxesPerCrate: 6, unitPrice: 5.00, active: true, createdAt: new Date() },
  { id: '118', name: 'POTINHO KIDS MORANGO 90ML', code: '38566', category: 'sorvete-kids', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '119', name: 'POTINHO KIDS CHOCOLATE 90ML', code: '38567', category: 'sorvete-kids', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '120', name: 'POTINHO KIDS BAUNILHA 90ML', code: '38568', category: 'sorvete-kids', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '121', name: 'POTINHO KIDS CREME 90ML', code: '38560', category: 'sorvete-kids', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '122', name: 'POTINHO KIDS FLOCOS 90ML', code: '38570', category: 'sorvete-kids', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '123', name: 'POTINHO KIDS NAPOLITANO 90ML', code: '38571', category: 'sorvete-kids', unitsPerBox: 4, unitsPerCrate: 136, boxesPerCrate: 34, unitPrice: 3.50, active: true, createdAt: new Date() },
  { id: '124', name: 'PICOLÉ PET CREME 70G', code: '35828', category: 'picole-pet', unitsPerBox: 10, unitsPerCrate: 60, boxesPerCrate: 6, unitPrice: 8.00, active: true, createdAt: new Date() },
  { id: '125', name: 'PICOLÉ PET CARNE 70G', code: '35830', category: 'picole-pet', unitsPerBox: 10, unitsPerCrate: 60, boxesPerCrate: 6, unitPrice: 8.00, active: true, createdAt: new Date() },
  { id: '126', name: 'PICOLÉ PET FRANGO 70G', code: '35831', category: 'picole-pet', unitsPerBox: 10, unitsPerCrate: 60, boxesPerCrate: 6, unitPrice: 8.00, active: true, createdAt: new Date() },
  { id: '127', name: 'PICOLÉ PET BACON 70G', code: '35832', category: 'picole-pet', unitsPerBox: 10, unitsPerCrate: 60, boxesPerCrate: 6, unitPrice: 8.00, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - CAMISETAS
  // ========================
  { id: '128', name: 'CAMISETA CINZA ESKIMO G', code: '40004', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '129', name: 'CAMISETA CINZA ESKIMO G1', code: '40006', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '130', name: 'CAMISETA CINZA ESKIMO G2', code: '43057', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '131', name: 'CAMISETA CINZA ESKIMO G3', code: '42191', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '132', name: 'CAMISETA CINZA ESKIMO GG', code: '40005', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '133', name: 'CAMISETA CINZA ESKIMO M', code: '40003', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '134', name: 'CAMISETA CINZA ESKIMO P', code: '40002', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '135', name: 'CAMISETA CINZA ESKIMO PP', code: '40001', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '136', name: 'CAMISETA VERMELHA ESKIMO EG', code: '22300', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '137', name: 'CAMISETA VERMELHA ESKIMO G', code: '4137', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '138', name: 'CAMISETA VERMELHA ESKIMO GG', code: '3203', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '139', name: 'CAMISETA VERMELHA ESKIMO M', code: '4136', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '140', name: 'CAMISETA VERMELHA ESKIMO P', code: '4135', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '141', name: 'CAMISETA VERMELHA ESKIMO XXG', code: '36701', category: 'camisetas', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - ACESSÓRIOS
  // ========================
  { id: '142', name: 'COLHER BUFFET SORVETE COLORIDA', code: '9278', category: 'acessorios', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '143', name: 'TIGELA PARA SORVETES DE PLASTICO C/ PAZINHA PP', code: '36378', category: 'acessorios', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - TORRONE
  // ========================
  { id: '144', name: 'TORRONE COM CASTANHA DE CAJU 45G', code: '43727', category: 'torrone', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '145', name: 'TORRONE COM AMENDOIM 45G', code: '43987', category: 'torrone', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '146', name: 'TORRONE AMENDOIM SABOR MEL MANDOLATCHE', code: '40677', category: 'torrone', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - COBERTURA
  // ========================
  { id: '147', name: 'COBERTURA NORMAL CARAMELO 270GR', code: '27085', category: 'cobertura', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '148', name: 'COBERTURA NORMAL CHOCOLATE 270GR', code: '27086', category: 'cobertura', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '149', name: 'COBERTURA NORMAL MORANGO 270GR', code: '27087', category: 'cobertura', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '150', name: 'COBERTURA NORMAL FRUTAS VERMELHAS 270GR', code: '35101', category: 'cobertura', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - WAFER
  // ========================
  { id: '151', name: 'ROLINHO WAFFER TUB-IN NAPOLITANO', code: '31910', category: 'wafer', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '152', name: 'ROLINHO WAFFER TUB-IN CHOCOLATE', code: '31908', category: 'wafer', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '153', name: 'ROLINHO WAFFER TUB-IN TRUFAS', code: '31911', category: 'wafer', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '154', name: 'ROLINHO WAFFER TUB-IN MORANGO', code: '31909', category: 'wafer', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '155', name: 'ROLINHO WAFFER TUB-IN BRIGADEIRO', code: '32101', category: 'wafer', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '156', name: 'ROLINHO WAFER TUB-IN LIMÃO', code: '45320', category: 'wafer', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - ISOPOR
  // ========================
  { id: '157', name: 'CAIXA ISOPOR 13 LTS BRANCA', code: '9483', category: 'isopor', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '158', name: 'CAIXA ISOPOR 18 LTS BRANCA', code: '9484', category: 'isopor', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '159', name: 'CAIXA ISOPOR 8 LTS BRANCA', code: '8748', category: 'isopor', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '160', name: 'BOLSAO TERMICO VERMELHA C/ LOGO 19L', code: '1236', category: 'isopor', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - CASQUINHA
  // ========================
  { id: '161', name: 'CASQUINHA DE SORVETE CROCANTE 65G MONTEVERGINE', code: '43704', category: 'casquinha', unitsPerBox: 16, unitsPerCrate: 16, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - TUBON
  // ========================
  { id: '162', name: 'TUBON BON MORANGO', code: '43909', category: 'tubon', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '163', name: 'TUBON BON CHOCOLATE', code: '43910', category: 'tubon', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '164', name: 'TUBON BON LIMÃO', code: '43911', category: 'tubon', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '165', name: 'TUBON BON LEITE', code: '43912', category: 'tubon', unitsPerBox: 24, unitsPerCrate: 24, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - BALAS E DOCES DORI
  // ========================
  { id: '166', name: 'DELIKET 100G DORI', code: '43494', category: 'balas-doces', unitsPerBox: 30, unitsPerCrate: 30, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '167', name: 'DELIKET ACIDO 100G DORI', code: '43495', category: 'balas-doces', unitsPerBox: 30, unitsPerCrate: 30, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '168', name: 'GOMETS 100G DORI', code: '43496', category: 'balas-doces', unitsPerBox: 30, unitsPerCrate: 30, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '169', name: 'GOMETS ANEL 100G DORI', code: '43497', category: 'balas-doces', unitsPerBox: 30, unitsPerCrate: 30, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '170', name: 'GOMETS MINHOCA 100G DORI', code: '43498', category: 'balas-doces', unitsPerBox: 30, unitsPerCrate: 30, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '171', name: 'GOMETS MINHOCA ACIDA 100G DORI', code: '43499', category: 'balas-doces', unitsPerBox: 30, unitsPerCrate: 30, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '172', name: 'GOMETS URSO 100G DORI', code: '43500', category: 'balas-doces', unitsPerBox: 30, unitsPerCrate: 30, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '173', name: 'GELATINA AMORA 60G DORI', code: '43501', category: 'balas-doces', unitsPerBox: 16, unitsPerCrate: 16, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '174', name: 'GELATINA BANANA 60G DORI', code: '43502', category: 'balas-doces', unitsPerBox: 16, unitsPerCrate: 16, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '175', name: 'GELATINA BOCA 60G DORI', code: '43503', category: 'balas-doces', unitsPerBox: 16, unitsPerCrate: 16, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '176', name: 'GELATINA MINHOCA 60G DORI', code: '43504', category: 'balas-doces', unitsPerBox: 16, unitsPerCrate: 16, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '177', name: 'GELATINA MINHOCA ACIDA 60G DORI', code: '43505', category: 'balas-doces', unitsPerBox: 16, unitsPerCrate: 16, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '178', name: 'GELATINA URSO 60G DORI', code: '43506', category: 'balas-doces', unitsPerBox: 16, unitsPerCrate: 16, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '179', name: 'REGALIZ FLOR 60G DORI', code: '43507', category: 'balas-doces', unitsPerBox: 16, unitsPerCrate: 16, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '180', name: 'REGALIZ TIJOLO 60G DORI', code: '43508', category: 'balas-doces', unitsPerBox: 16, unitsPerCrate: 16, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '181', name: 'REGALIZ TUBO ACIDO MORANGO 70G DORI', code: '43509', category: 'balas-doces', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '182', name: 'REGALIZ TUBO ACIDO UVA 70G DORI', code: '43510', category: 'balas-doces', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '183', name: 'REGALIZ TUBO ACIDO YOGURTE 70G DORI', code: '43511', category: 'balas-doces', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '184', name: 'REGALIZ TUBO MORANGO 70G DORI', code: '43512', category: 'balas-doces', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '185', name: 'REGALIZ TUBO YOGURTE 70G DORI', code: '43513', category: 'balas-doces', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '186', name: 'DISQUETI CHOCOLATE 60G DORI', code: '43514', category: 'balas-doces', unitsPerBox: 1, unitsPerCrate: 1, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '187', name: 'DISPLAY CHICLETE FRULETS 7G', code: '44967', category: 'balas-doces', unitsPerBox: 800, unitsPerCrate: 800, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - SALGADINHOS
  // ========================
  { id: '188', name: 'BATATA CHIPS 100G CEBOLA E SALSA', code: '44125', category: 'salgadinhos', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '189', name: 'BATATA CHIPS 100G CHURRASCO', code: '44126', category: 'salgadinhos', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '190', name: 'BATATA CHIPS 100G LISA SAL MARINHO', code: '44127', category: 'salgadinhos', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '191', name: 'BATATA CHIPS 100G TRADICIONAL', code: '44128', category: 'salgadinhos', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '192', name: 'BATATA CHIPS 100G PAO DE ALHO', code: '44129', category: 'salgadinhos', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '193', name: 'SALGADINHO SENSE MAIS MILHO CEBOLA 140G', code: '44130', category: 'salgadinhos', unitsPerBox: 10, unitsPerCrate: 10, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '194', name: 'SALGADINHO SENSE MAIS MILHO PRESUNTO 150G', code: '44131', category: 'salgadinhos', unitsPerBox: 10, unitsPerCrate: 10, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '195', name: 'SALGADINHO SENSE MAIS MILHO QUEIJO 150G', code: '44132', category: 'salgadinhos', unitsPerBox: 10, unitsPerCrate: 10, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '196', name: 'SALGADINHO SENSE MAIS MILHO REQUEIJAO 150G', code: '44133', category: 'salgadinhos', unitsPerBox: 10, unitsPerCrate: 10, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '197', name: 'SALGADINHO BACON CRISP 100G', code: '44134', category: 'salgadinhos', unitsPerBox: 10, unitsPerCrate: 10, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  
  // ========================
  // PRODUTOS SECOS - REVENDA
  // ========================
  { id: '198', name: 'REVENDA - CASCAO P (RL C/10 UN)', code: '8894', category: 'revenda', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 0, active: true, createdAt: new Date() },
  { id: '199', name: 'REVENDA - CASCAO 190G (RL C/10 UN)', code: '45990', category: 'revenda', unitsPerBox: 12, unitsPerCrate: 12, boxesPerCrate: 1, unitPrice: 8.10, active: true, createdAt: new Date() },
];

export const mockUsers: User[] = [
  { id: '1', name: 'Suporte VIAURB', email: 'suporte.viaurb@gmail.com', role: 'admin', active: true, createdAt: new Date() },
];

// Lista de operadores disponíveis para pedidos, separação e entrega
export const OPERATORS = [
  { id: '1', name: 'Suporte VIAURB' },
];
export const STORES: Store[] = ['morretes', 'meia_praia', 'pereque', 'centro'];

export const mockOrders: Order[] = [];

// Dados fixos da empresa para o PDF
export const COMPANY_INFO = {
  discount: 0.42, // 42%
  paymentMethod: 'BOLETO',
  razaoSocial: '',
  cpfCnpj: '',
  endereco: '',
  cidade: '',
  prazo: '',
};
