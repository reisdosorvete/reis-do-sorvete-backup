import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const PRODUTOS_REAIS = [
  // Acessórios
  { code: '9278', name: 'COLHER BUFFET SORVETE COLORIDA', category: 'acessorios', unit_price: 0.00, units_per_box: 1, boxes_per_crate: 1, units_per_crate: 1, active: true, stock_quantity: 1 },
  { code: '36378', name: 'TIGELA PARA SORVETES DE PLASTICO C/ PAZINHA', category: 'acessorios', unit_price: 0.00, units_per_box: 1, boxes_per_crate: 1, units_per_crate: 1, active: true, stock_quantity: 1 },

  // Açaí
  { code: '41665', name: 'AÇAÍ 180G ANGA C/ BANANA', category: 'acai', unit_price: 12.00, units_per_box: 1, boxes_per_crate: 63, units_per_crate: 63, active: true, stock_quantity: 63 },
  { code: '41629', name: 'AÇAÍ 180G ANGA C/ GUARANA', category: 'acai', unit_price: 12.00, units_per_box: 1, boxes_per_crate: 63, units_per_crate: 63, active: true, stock_quantity: 63 },
  { code: '30999', name: 'AÇAI 1L C/ BANANA', category: 'acai', unit_price: 29.00, units_per_box: 1, boxes_per_crate: 32, units_per_crate: 32, active: true, stock_quantity: 32 },
  { code: '30998', name: 'AÇAÍ 1L C/ GUARANA', category: 'acai', unit_price: 29.00, units_per_box: 1, boxes_per_crate: 32, units_per_crate: 32, active: true, stock_quantity: 32 },

  // Balas e Doces
  { code: '43494', name: 'DELIKET 100G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 30, boxes_per_crate: 1, units_per_crate: 30, active: true, stock_quantity: 30 },
  { code: '43495', name: 'DELIKET ACIDO 100G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 30, boxes_per_crate: 1, units_per_crate: 30, active: true, stock_quantity: 30 },
  { code: '44967', name: 'DISPLAY CHICLETE FRULETS 7G', category: 'balas-doces', unit_price: 0.00, units_per_box: 800, boxes_per_crate: 1, units_per_crate: 800, active: true, stock_quantity: 800 },
  { code: '43514', name: 'DISQUETI CHOCOLATE 60G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 1, boxes_per_crate: 1, units_per_crate: 1, active: true, stock_quantity: 1 },
  { code: '43501', name: 'GELATINA AMORA 60G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 16, boxes_per_crate: 1, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '43502', name: 'GELATINA BANANA 60G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 16, boxes_per_crate: 1, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '43503', name: 'GELATINA BOCA 60G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 16, boxes_per_crate: 1, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '43504', name: 'GELATINA MINHOCA 60G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 16, boxes_per_crate: 1, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '43505', name: 'GELATINA MINHOCA ACIDA 60G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 16, boxes_per_crate: 1, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '43506', name: 'GELATINA URSO 60G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 16, boxes_per_crate: 1, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '43496', name: 'GOMETS 100G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 30, boxes_per_crate: 1, units_per_crate: 30, active: true, stock_quantity: 30 },
  { code: '43497', name: 'GOMETS ANEL 100G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 30, boxes_per_crate: 1, units_per_crate: 30, active: true, stock_quantity: 30 },
  { code: '43498', name: 'GOMETS MINHOCA 100G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 30, boxes_per_crate: 1, units_per_crate: 30, active: true, stock_quantity: 30 },
  { code: '43499', name: 'GOMETS MINHOCA ACIDA 100G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 30, boxes_per_crate: 1, units_per_crate: 30, active: true, stock_quantity: 30 },
  { code: '43500', name: 'GOMETS URSO 100G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 30, boxes_per_crate: 1, units_per_crate: 30, active: true, stock_quantity: 30 },
  { code: '43507', name: 'REGALIZ FLOR 60G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 16, boxes_per_crate: 1, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '43508', name: 'REGALIZ TIJOLO 60G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 16, boxes_per_crate: 1, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '43509', name: 'REGALIZ TUBO ACIDO MORANGO 70G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 12, boxes_per_crate: 1, units_per_crate: 12, active: true, stock_quantity: 12 },
  { code: '43510', name: 'REGALIZ TUBO ACIDO UVA 70G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 12, boxes_per_crate: 1, units_per_crate: 12, active: true, stock_quantity: 12 },
  { code: '43511', name: 'REGALIZ TUBO ACIDO YOGURTE 70G', category: 'balas-doces', unit_price: 0.00, units_per_box: 12, boxes_per_crate: 1, units_per_crate: 12, active: true, stock_quantity: 12 },
  { code: '43512', name: 'REGALIZ TUBO MORANGO 70G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 12, boxes_per_crate: 1, units_per_crate: 12, active: true, stock_quantity: 12 },
  { code: '43513', name: 'REGALIZ TUBO YOGURTE 70G DORI', category: 'balas-doces', unit_price: 0.00, units_per_box: 12, boxes_per_crate: 1, units_per_crate: 12, active: true, stock_quantity: 12 },

  // Barrita e Super Barrita
  { code: '8802', name: 'PICOLE BARRITA', category: 'picole-barrita', unit_price: 6.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },
  { code: '8803', name: 'PICOLÉ SUPER BARRITA', category: 'picole-super-barrita', unit_price: 6.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },

  // Best Cup
  { code: '26259', name: 'BEST CUP 750ML ABACAXI AO VINHO', category: 'sorvete-best-cup', unit_price: 19.50, units_per_box: 1, boxes_per_crate: 24, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '36903', name: 'BEST CUP 750ML CHOCODULCE', category: 'sorvete-best-cup', unit_price: 19.50, units_per_box: 1, boxes_per_crate: 24, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '44204', name: 'BEST CUP 750ML CHOCOLATE DUBAI', category: 'sorvete-best-cup', unit_price: 19.50, units_per_box: 1, boxes_per_crate: 24, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '30771', name: 'BEST CUP 750ML CHOCOMALT', category: 'sorvete-best-cup', unit_price: 19.50, units_per_box: 1, boxes_per_crate: 24, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '26552', name: 'BEST CUP 750ML DOCE DE LEITE', category: 'sorvete-best-cup', unit_price: 19.50, units_per_box: 1, boxes_per_crate: 24, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '26262', name: 'BEST CUP 750ML FLORESTA NEGRA', category: 'sorvete-best-cup', unit_price: 19.50, units_per_box: 1, boxes_per_crate: 24, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '36902', name: 'BEST CUP 750ML MIL FOLHAS', category: 'sorvete-best-cup', unit_price: 19.50, units_per_box: 1, boxes_per_crate: 24, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '26261', name: 'BEST CUP 750ML PISTACHE', category: 'sorvete-best-cup', unit_price: 19.50, units_per_box: 1, boxes_per_crate: 24, units_per_crate: 24, active: true, stock_quantity: 24 },

  // Bombom no Palito
  { code: '24047', name: 'PICOLE BOMBOM BRIGADEIRO', category: 'picole-bombom', unit_price: 5.50, units_per_box: 33, boxes_per_crate: 6, units_per_crate: 198, active: true, stock_quantity: 198 },
  { code: '24048', name: 'PICOLE BOMBOM SKIMO', category: 'picole-bombom', unit_price: 5.50, units_per_box: 33, boxes_per_crate: 6, units_per_crate: 198, active: true, stock_quantity: 198 },

  // Camisetas
  { code: '40004', name: 'CAMISETA CINZA ESKIMO G', category: 'camisetas', unit_price: 0.00, units_per_box: 1, boxes_per_crate: 1, units_per_crate: 1, active: true, stock_quantity: 1 },
  { code: '40003', name: 'CAMISETA CINZA ESKIMO M', category: 'camisetas', unit_price: 0.00, units_per_box: 1, boxes_per_crate: 1, units_per_crate: 1, active: true, stock_quantity: 1 },
  { code: '4137', name: 'CAMISETA VERMELHA ESKIMO G', category: 'camisetas', unit_price: 0.00, units_per_box: 1, boxes_per_crate: 1, units_per_crate: 1, active: true, stock_quantity: 1 },

  // Casquinha
  { code: '43704', name: 'CASQUINHA CROCANTE 65G MONTEVERGINE', category: 'casquinha', unit_price: 0.00, units_per_box: 16, boxes_per_crate: 1, units_per_crate: 16, active: true, stock_quantity: 16 },

  // Chocotine
  { code: '44899', name: 'PICOLE CHOCOTINE', category: 'picole-chocotine', unit_price: 6.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },

  // Coberturas
  { code: '27085', name: 'COBERTURA CARAMELO 270GR', category: 'cobertura', unit_price: 0.00, units_per_box: 24, boxes_per_crate: 1, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '27086', name: 'COBERTURA CHOCOLATE 270GR', category: 'cobertura', unit_price: 0.00, units_per_box: 24, boxes_per_crate: 1, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '35101', name: 'COBERTURA FRUTAS VERMELHAS 270GR', category: 'cobertura', unit_price: 0.00, units_per_box: 24, boxes_per_crate: 1, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '27087', name: 'COBERTURA MORANGO 270GR', category: 'cobertura', unit_price: 0.00, units_per_box: 24, boxes_per_crate: 1, units_per_crate: 24, active: true, stock_quantity: 24 },

  // Copinho Gourmet
  { code: '24099', name: 'COPINHO GOURMET BOMBOM COCO 150ML', category: 'sorvete-copinho-gourmet', unit_price: 4.50, units_per_box: 4, boxes_per_crate: 34, units_per_crate: 136, active: true, stock_quantity: 136 },
  { code: '24100', name: 'COPINHO GOURMET CARAM SALG & COOKIES', category: 'sorvete-copinho-gourmet', unit_price: 4.50, units_per_box: 4, boxes_per_crate: 34, units_per_crate: 136, active: true, stock_quantity: 136 },
  { code: '24102', name: 'COPINHO GOURMET MORAN. AO LEIT.', category: 'sorvete-copinho-gourmet', unit_price: 4.50, units_per_box: 4, boxes_per_crate: 34, units_per_crate: 136, active: true, stock_quantity: 136 },
  { code: '24111', name: 'COPINHO GOURMET NINHO TRUFADO', category: 'sorvete-copinho-gourmet', unit_price: 4.50, units_per_box: 4, boxes_per_crate: 34, units_per_crate: 136, active: true, stock_quantity: 136 },
  { code: '24109', name: 'COPINHO GOURMET PISTACHE 150ML', category: 'sorvete-copinho-gourmet', unit_price: 4.50, units_per_box: 4, boxes_per_crate: 34, units_per_crate: 136, active: true, stock_quantity: 136 },
  { code: '24103', name: 'COPINHO GOURMET TORTA DE LIMÃO', category: 'sorvete-copinho-gourmet', unit_price: 4.50, units_per_box: 4, boxes_per_crate: 34, units_per_crate: 136, active: true, stock_quantity: 136 },

  // Diamond
  { code: '24067', name: 'PICOLÉ DIAMOND CHOCOMALT', category: 'picole-diamond', unit_price: 5.50, units_per_box: 26, boxes_per_crate: 6, units_per_crate: 156, active: true, stock_quantity: 156 },
  { code: '24068', name: 'PICOLÉ DIAMOND COOKIES', category: 'picole-diamond', unit_price: 5.50, units_per_box: 26, boxes_per_crate: 6, units_per_crate: 156, active: true, stock_quantity: 156 },
  { code: '24069', name: 'PICOLÉ DIAMOND COOKIES BIANCO', category: 'picole-diamond', unit_price: 5.50, units_per_box: 26, boxes_per_crate: 6, units_per_crate: 156, active: true, stock_quantity: 156 },
  { code: '41604', name: 'PICOLÉ DIAMOND FRUTAS VERMELHAS', category: 'picole-diamond', unit_price: 5.50, units_per_box: 26, boxes_per_crate: 6, units_per_crate: 156, active: true, stock_quantity: 156 },
  { code: '41603', name: 'PICOLÉ DIAMOND PISTACHE', category: 'picole-diamond', unit_price: 5.50, units_per_box: 26, boxes_per_crate: 6, units_per_crate: 156, active: true, stock_quantity: 156 },

  // Grand Nevado
  { code: '43335', name: 'POTE NEVADO 1,5L BANOFFEE', category: 'sorvete-grand-nevado', unit_price: 22.50, units_per_box: 1, boxes_per_crate: 16, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '24169', name: 'POTE NEVADO 1,5L NATA TRUFADA', category: 'sorvete-grand-nevado', unit_price: 22.50, units_per_box: 1, boxes_per_crate: 16, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '24168', name: 'POTE NEVADO 1,5L YOG. GREGO C/AMORA', category: 'sorvete-grand-nevado', unit_price: 22.50, units_per_box: 1, boxes_per_crate: 16, units_per_crate: 16, active: true, stock_quantity: 16 },

  // Ituzinho
  { code: '24091', name: 'PICOLĖ ITUZINHO CHICLETES', category: 'picole-ituzinho', unit_price: 3.75, units_per_box: 30, boxes_per_crate: 6, units_per_crate: 180, active: true, stock_quantity: 180 },
  { code: '24092', name: 'PICOLĖ ITUZINHO LEITINHO TRUFADO', category: 'picole-ituzinho', unit_price: 3.75, units_per_box: 30, boxes_per_crate: 6, units_per_crate: 180, active: true, stock_quantity: 180 },
  { code: '24093', name: 'PICOLĖ ITUZINHO MOUSSE DE MARACUJA', category: 'picole-ituzinho', unit_price: 3.75, units_per_box: 30, boxes_per_crate: 6, units_per_crate: 180, active: true, stock_quantity: 180 },

  // La Sobremesa
  { code: '29927', name: 'PICOLÉ LA SOBREMESA CHURROS', category: 'picole-la-sobremesa', unit_price: 4.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },
  { code: '43338', name: 'PICOLÉ LA SOBREMESA LIMONADA SUICA', category: 'picole-la-sobremesa', unit_price: 4.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },
  { code: '37488', name: 'PICOLÉ LA SOBREMESA PUDIM DE LEITE', category: 'picole-la-sobremesa', unit_price: 4.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },
  { code: '29925', name: 'PICOLÉ LA SOBREMESA QUATRO LEITES COM AMARENA', category: 'picole-la-sobremesa', unit_price: 4.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },
  { code: '37489', name: 'PICOLÉ LA SOBREMESA ROMEU & JULIETA', category: 'picole-la-sobremesa', unit_price: 4.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },
  { code: '29926', name: 'PICOLÉ LA SOBREMESA SAGU', category: 'picole-la-sobremesa', unit_price: 4.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },
  { code: '37490', name: 'PICOLÉ LA SOBREMESA TORTA DE LIMÃO', category: 'picole-la-sobremesa', unit_price: 4.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },
  { code: '8003', name: 'PICOLÉ MOCAFFE', category: 'picole-la-sobremesa', unit_price: 6.50, units_per_box: 38, boxes_per_crate: 6, units_per_crate: 228, active: true, stock_quantity: 228 },

  // Los Palitos / Linha Mais
  { code: '24081', name: 'PICOLÉ MEX. MARACUJA C/LEITE COND', category: 'picole-los-palitos', unit_price: 6.50, units_per_box: 30, boxes_per_crate: 6, units_per_crate: 180, active: true, stock_quantity: 180 },
  { code: '24082', name: 'PICOLÉ MEX. MORANGO C/LEITE COND', category: 'picole-los-palitos', unit_price: 6.50, units_per_box: 30, boxes_per_crate: 6, units_per_crate: 180, active: true, stock_quantity: 180 },
  { code: '40042', name: 'PICOLÉ COCO QUEIMADO (MAIS)', category: 'picole-linha-mais', unit_price: 3.75, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24058', name: 'PICOLÉ MAIS COCO', category: 'picole-linha-mais', unit_price: 3.75, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24059', name: 'PICOLÉ MAIS PACOCA', category: 'picole-linha-mais', unit_price: 3.75, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },

  // Picolé Creme
  { code: '24033', name: 'PICOLÉ CREME CHOCOLATE', category: 'picole-creme', unit_price: 3.50, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24034', name: 'PICOLÉ CREME COCO BRANCO', category: 'picole-creme', unit_price: 3.50, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '41784', name: 'PICOLÉ CREME DOCE LEITE', category: 'picole-creme', unit_price: 3.50, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24037', name: 'PICOLÉ CREME LEITE CONDENSADO', category: 'picole-creme', unit_price: 3.50, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24035', name: 'PICOLÉ CREME MILHO VERDE', category: 'picole-creme', unit_price: 3.50, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24036', name: 'PICOLÉ CREME MORANGO', category: 'picole-creme', unit_price: 3.50, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '36972', name: 'PICOLÉ CREME NATA', category: 'picole-creme', unit_price: 3.50, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24043', name: 'PICOLÉ CREME SPECIALE CHOCOLATE', category: 'picole-creme-speciale', unit_price: 3.75, units_per_box: 30, boxes_per_crate: 6, units_per_crate: 180, active: true, stock_quantity: 180 },

  // Picolé Fruta
  { code: '24017', name: 'PICOLE FRUTA ABACAXI', category: 'picole-fruta', unit_price: 2.00, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24019', name: 'PICOLE FRUTA FRAMBOESA', category: 'picole-fruta', unit_price: 2.00, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24021', name: 'PICOLE FRUTA LIMÃO', category: 'picole-fruta', unit_price: 2.00, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '43341', name: 'PICOLE FRUTA MARACUJA', category: 'picole-fruta', unit_price: 2.00, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24022', name: 'PICOLE FRUTA MINI-SAIΑ', category: 'picole-fruta', unit_price: 2.00, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '43340', name: 'PICOLE FRUTA MORANGO', category: 'picole-fruta', unit_price: 2.00, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '24023', name: 'PICOLE FRUTA UVA', category: 'picole-fruta', unit_price: 2.00, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '35252', name: 'PICOLE FRUTA ÁGUA DE COCO', category: 'picole-fruta', unit_price: 2.00, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },

  // Picolé Grego e Kids e Pet e Zero
  { code: '24052', name: 'PICOLÉ GREGO FRUTAS VERMELHAS', category: 'picole-grego', unit_price: 3.75, units_per_box: 30, boxes_per_crate: 6, units_per_crate: 180, active: true, stock_quantity: 180 },
  { code: '39522', name: 'PICOLÉ BOB ESPONJA', category: 'picole-kids', unit_price: 5.00, units_per_box: 20, boxes_per_crate: 6, units_per_crate: 120, active: true, stock_quantity: 120 },
  { code: '37904', name: 'PICOLÉ KIDS DINOSSAURO', category: 'picole-kids', unit_price: 5.00, units_per_box: 20, boxes_per_crate: 6, units_per_crate: 120, active: true, stock_quantity: 120 },
  { code: '42076', name: 'PICOLĖ TURMA DA MONICA MORANGO', category: 'picole-kids', unit_price: 2.00, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  { code: '35832', name: 'PICOLÉ PET BACON 70G', category: 'picole-pet', unit_price: 8.00, units_per_box: 10, boxes_per_crate: 6, units_per_crate: 60, active: true, stock_quantity: 60 },
  { code: '35830', name: 'PICOLÉ PET CARNE 70G', category: 'picole-pet', unit_price: 8.00, units_per_box: 10, boxes_per_crate: 6, units_per_crate: 60, active: true, stock_quantity: 60 },
  { code: '24121', name: 'PICOLÉ ZERO AÇUCAR CHOCOLATE', category: 'picole-zero', unit_price: 3.75, units_per_box: 45, boxes_per_crate: 6, units_per_crate: 270, active: true, stock_quantity: 270 },
  
  // Potes 2 Litros e Napolicup e Kids e Zero
  { code: '9070', name: 'NAPOLICUP 250ML', category: 'sorvete-napolicup', unit_price: 6.75, units_per_box: 1, boxes_per_crate: 60, units_per_crate: 60, active: true, stock_quantity: 60 },
  { code: '24142', name: 'POTE 2L CHOCOLATE BRANCO', category: 'sorvete-pote-2l', unit_price: 19.75, units_per_box: 1, boxes_per_crate: 16, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '24150', name: 'POTE 2L CREME', category: 'sorvete-pote-2l', unit_price: 26.50, units_per_box: 1, boxes_per_crate: 16, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '24143', name: 'POTE 2L FLOCOS', category: 'sorvete-pote-2l', unit_price: 26.50, units_per_box: 1, boxes_per_crate: 16, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '24146', name: 'POTE 2L MORANGO', category: 'sorvete-pote-2l', unit_price: 19.75, units_per_box: 1, boxes_per_crate: 16, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '24147', name: 'POTE 2L NAPOLITANO', category: 'sorvete-pote-2l', unit_price: 26.50, units_per_box: 1, boxes_per_crate: 16, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '24149', name: 'POTE 2L TRUFA', category: 'sorvete-pote-2l', unit_price: 26.50, units_per_box: 1, boxes_per_crate: 16, units_per_crate: 16, active: true, stock_quantity: 16 },
  { code: '38567', name: 'POTINHO KIDS CHOCOLATE 90ML', category: 'sorvete-kids', unit_price: 3.50, units_per_box: 4, boxes_per_crate: 34, units_per_crate: 136, active: true, stock_quantity: 136 },
  { code: '24162', name: 'POTE DIET 1L BEIJINHO SÍRIO', category: 'sorvete-zero', unit_price: 22.50, units_per_box: 1, boxes_per_crate: 32, units_per_crate: 32, active: true, stock_quantity: 32 },
  { code: '36452', name: 'SUNDAE BAUNILHA COM CHOCOTELLA', category: 'sorvete-sundae', unit_price: 6.75, units_per_box: 2, boxes_per_crate: 28, units_per_crate: 56, active: true, stock_quantity: 56 },

  // Salgadinhos e Torrone
  { code: '44128', name: 'BATATA CHIPS 100G TRADICIONAL', category: 'salgadinhos', unit_price: 0.00, units_per_box: 12, boxes_per_crate: 1, units_per_crate: 12, active: true, stock_quantity: 12 },
  { code: '44134', name: 'SALGADINHO BACON CRISP 100G', category: 'salgadinhos', unit_price: 0.00, units_per_box: 10, boxes_per_crate: 1, units_per_crate: 10, active: true, stock_quantity: 10 },
  { code: '43987', name: 'TORRONE COM AMENDOIM 45G', category: 'torrone', unit_price: 0.00, units_per_box: 12, boxes_per_crate: 1, units_per_crate: 12, active: true, stock_quantity: 12 },

  // Seletto
  { code: '24125', name: 'CONE SELETTO BRIGADEIRO', category: 'picole-seletto', unit_price: 7.50, units_per_box: 4, boxes_per_crate: 28, units_per_crate: 112, active: true, stock_quantity: 112 },
  { code: '24126', name: 'CONE SELETTO CROCANTE', category: 'picole-seletto', unit_price: 7.50, units_per_box: 4, boxes_per_crate: 28, units_per_crate: 112, active: true, stock_quantity: 112 },

  // Torta, Tubon, Wafer
  { code: '24164', name: 'TORTA DE SORVETE ABACAXI C/COCO', category: 'sorvete-torta', unit_price: 29.00, units_per_box: 1, boxes_per_crate: 6, units_per_crate: 6, active: true, stock_quantity: 6 },
  { code: '43910', name: 'TUBON BON CHOCOLATE', category: 'tubon', unit_price: 0.00, units_per_box: 24, boxes_per_crate: 1, units_per_crate: 24, active: true, stock_quantity: 24 },
  { code: '31908', name: 'ROLINHO WAFFER TUB-IN CHOCOLATE', category: 'wafer', unit_price: 0.00, units_per_box: 24, boxes_per_crate: 1, units_per_crate: 24, active: true, stock_quantity: 24 },
];

export default function SeedProduct() {
  const [status, setStatus] = useState('Iniciando o Super Cadastro...');
  const [progress, setProgress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        setStatus('Limpando dados antigos...');
        await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        setStatus('Cadastrando os 112+ produtos reais do PDF com o saldo correto...');
        
        const batchSize = 20;
        for (let i = 0; i < PRODUTOS_REAIS.length; i += batchSize) {
          const lote = PRODUTOS_REAIS.slice(i, i + batchSize);
          setProgress(`Cadastrando lote ${Math.floor(i/batchSize) + 1}...`);
          
          const { error } = await supabase.from('products').insert(lote);
          if (error) throw error;
        }

        setStatus('✅ Produtos cadastrados com sucesso e saldos atualizados!');
        setProgress('Redirecionando para os pedidos...');
        setTimeout(() => navigate('/pedidos/novo'), 2000);
      } catch (e: any) {
        setStatus('Erro crítico: ' + e.message);
      }
    };
    setupDatabase();
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-sans">
      <div className="text-center p-10 border-2 border-primary rounded-3xl bg-slate-800 shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-black mb-4 uppercase tracking-tighter text-primary">Setup Reis do Sorvete</h1>
        <p className="text-lg mb-2 font-medium">{status}</p>
        <p className="text-sm opacity-60 text-primary">{progress}</p>
      </div>
    </div>
  );
}
