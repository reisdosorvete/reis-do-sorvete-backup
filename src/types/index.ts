 export type UserRole = 'usuario' | 'admin' | 'suporte';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
}

export type ProductCategory = 
  | 'picole-creme'
  | 'picole-fruta'
  | 'picole-fruta-calda'
  | 'picole-creme-speciale'
  | 'picole-ituzinho'
  | 'picole-kids'
  | 'picole-super-barrita'
  | 'picole-barrita'
  | 'picole-bombom'
  | 'picole-la-sobremesa'
  | 'picole-los-palitos'
  | 'picole-diamond'
  | 'picole-grego'
  | 'picole-zero'
  | 'picole-seletto'
  | 'picole-chocotine'
  | 'picole-linha-mais'
  | 'picole-pet'
  // Sorvetes
  | 'sorvete-pote-2l'
  | 'sorvete-classico-1-5l'
  | 'sorvete-napolitano'
  | 'sorvete-grand-nevado'
  | 'sorvete-torta'
  | 'sorvete-sundae'
  | 'sorvete-napolicup'
  | 'sorvete-copinho-gourmet'
  | 'sorvete-best-cup'
  | 'sorvete-zero'
  | 'sorvete-kids'
  // Açaí
  | 'acai'
  // Produtos Secos
  | 'camisetas'
  | 'acessorios'
  | 'torrone'
  | 'cobertura'
  | 'wafer'
  | 'isopor'
  | 'casquinha'
  | 'cascao'
  | 'tubon'
  | 'balas-doces'
  | 'salgadinhos'
  | 'revenda'
  // Extras
  | 'extras';

export interface Product {
  id: string;
  name: string;
  code: string;
  category: ProductCategory;
  unitsPerBox: number; 
  boxesPerCrate: number; 
  unitsPerCrate: number; 
  unitPrice: number;
  active: boolean;
  stock_quantity: number;
  createdAt: Date;
}

export type Store = 'morretes' | 'meia_praia' | 'pereque' | 'centro';

export type OrderStatus = 'criado' | 'separado' | 'entregue';

export interface OrderItem {
  productId: string;
  productName: string;
  productCode: string;
  unitsPerBox: number; // Unidades por caixa
  boxesPerCrate: number; // Caixas por engradado
  unitsPerCrate: number; // Unidades por engradado
  unitPrice: number;
  boxes: number; // Quantidade de caixas selecionadas
  totalUnits: number; // Total de unidades (todas as formas somadas)
  crates: number; // Engradados completos
  remainingBoxes: number; // Caixas restantes
  looseUnits: number; // Unidades avulsas
  isLoose?: boolean; // Legacy - mantido para compatibilidade
  isCrate?: boolean; // Se é venda por engradado (potes)
}

export interface Order {
  id: string;
  store: Store;
  items: OrderItem[];
  totalBoxes: number;
  totalCrates: number;
  totalRemainingBoxes: number;
  status: OrderStatus;
  createdBy: string;
  createdAt: Date;
  separatedBy?: string;
  separatedAt?: Date;
  deliveredBy?: string;
  deliveredAt?: Date;
}

export const STORE_NAMES: Record<Store, string> = {
  morretes: 'Morretes',
  meia_praia: 'Meia Praia',
  pereque: 'Perequê',
  centro: 'Centro'
};

export const STORE_INFO: Record<Store, { companyName: string; cnpj: string }> = {
  morretes: { companyName: 'Reis do Sorvete', cnpj: '24.348.156/0001-26' },
  centro: { companyName: 'Reis do Sorvete', cnpj: '24.348.156/0002-07' },
  pereque: { companyName: 'Reis do Sorvete', cnpj: '24.348.156/0003-98' },
  meia_praia: { companyName: 'Reis do Sorvete', cnpj: '24.348.156/0004-79' },
};

export const CATEGORY_NAMES: Record<ProductCategory, string> = {
  // Picolés
  'picole-creme': 'Picolé Creme',
  'picole-fruta': 'Picolé Fruta',
  'picole-fruta-calda': 'Picolé Fruta + Calda',
  'picole-creme-speciale': 'Picolé Creme Speciale',
  'picole-ituzinho': 'Ituzinho',
  'picole-kids': 'Picolé Kids',
  'picole-super-barrita': 'Super Barrita',
  'picole-barrita': 'Barrita',
  'picole-bombom': 'Bombom no Palito',
  'picole-la-sobremesa': 'La Sobremesa',
  'picole-los-palitos': 'Los Palitos Mexicanos',
  'picole-diamond': 'Diamond',
  'picole-grego': 'Picolé Grego',
  'picole-zero': 'Picolé Zero',
  'picole-seletto': 'Seletto',
  'picole-chocotine': 'Chocotine',
  'picole-linha-mais': 'Mais',
  'picole-pet': 'Picolé Pet',
  // Sorvetes
  'sorvete-pote-2l': 'Pote 2 Litros',
  'sorvete-classico-1-5l': 'Clássicos 1,5L',
  'sorvete-napolitano': 'Napolitano',
  'sorvete-grand-nevado': 'Grand Nevado',
  'sorvete-torta': 'Torta de Sorvete',
  'sorvete-sundae': 'Sundae',
  'sorvete-napolicup': 'Napolicup',
  'sorvete-copinho-gourmet': 'Copinho Gourmet',
  'sorvete-best-cup': 'Best Cup',
  'sorvete-zero': 'Sorvete Zero',
  'sorvete-kids': 'Potinho Kids',
  // Açaí
  'acai': 'Açaí',
  // Produtos Secos
  'camisetas': 'Camisetas',
  'acessorios': 'Acessórios',
  'torrone': 'Torrone',
  'cobertura': 'Coberturas',
  'wafer': 'Wafer',
  'isopor': 'Isopor',
  'casquinha': 'Casquinha',
  'cascao': 'Cascão',
  'tubon': 'Tubon',
  'balas-doces': 'Balas e Doces',
  'salgadinhos': 'Salgadinhos',
  'revenda': 'Revenda',
  // Extras
  'extras': 'Extras',
};

export const ROLE_NAMES: Record<UserRole, string> = {
  'usuario': 'Usuário',
  'admin': 'Administrador',
  'suporte': 'Suporte',
};

export const STATUS_NAMES: Record<OrderStatus, string> = {
  'criado': 'Criado',
  'separado': 'Separado',
  'entregue': 'Entregue',
};

// Grupos de categorias para facilitar filtros
export const CATEGORY_GROUPS = {
  picoles: [
    'picole-creme',
    'picole-fruta',
    'picole-fruta-calda',
    'picole-creme-speciale',
    'picole-ituzinho',
    'picole-kids',
    'picole-super-barrita',
    'picole-barrita',
    'picole-bombom',
    'picole-la-sobremesa',
    'picole-los-palitos',
    'picole-diamond',
    'picole-grego',
    'picole-zero',
    'picole-seletto',
    'picole-chocotine',
    'picole-linha-mais',
    'picole-pet',
  ] as ProductCategory[],
  sorvetes: [
    'sorvete-pote-2l',
    'sorvete-classico-1-5l',
    'sorvete-napolitano',
    'sorvete-grand-nevado',
    'sorvete-torta',
    'sorvete-sundae',
    'sorvete-napolicup',
    'sorvete-copinho-gourmet',
    'sorvete-best-cup',
    'sorvete-zero',
    'sorvete-kids',
  ] as ProductCategory[],
  acai: ['acai'] as ProductCategory[],
  secos: [
    'camisetas',
    'acessorios',
    'torrone',
    'cobertura',
    'wafer',
    'isopor',
    'casquinha',
    'cascao',
    'tubon',
    'balas-doces',
    'salgadinhos',
    'revenda',
  ] as ProductCategory[],
  extras: ['extras'] as ProductCategory[],
};

export const CATEGORY_GROUP_NAMES = {
  picoles: 'Picolés',
  sorvetes: 'Sorvetes',
  acai: 'Açaí',
  secos: 'Produtos Secos',
  extras: 'Extras',
};
 
// Categorias que suportam venda dupla (caixa + unidade)
export const DUAL_SALE_CATEGORIES: ProductCategory[] = [
  'picole-creme',
  'picole-fruta',
  'picole-fruta-calda',
  'picole-creme-speciale',
  'picole-ituzinho',
  'picole-kids',
  'picole-super-barrita',
  'picole-barrita',
  'picole-bombom',
  'picole-la-sobremesa',
  'picole-los-palitos',
  'picole-diamond',
  'picole-grego',
  'picole-zero',
  'picole-seletto',
  'picole-chocotine',
  'picole-linha-mais',
  'picole-pet',
  'sorvete-sundae',
  'cobertura',
  'sorvete-copinho-gourmet',
  'wafer',
];

// Categorias que suportam venda dupla por engradado + unidade
export const CRATE_SALE_CATEGORIES: ProductCategory[] = [
  'sorvete-pote-2l',
  'sorvete-classico-1-5l',
  'sorvete-napolitano',
  'sorvete-grand-nevado',
  'sorvete-zero',
];

export function isDualSaleCategory(category: ProductCategory): boolean {
  return DUAL_SALE_CATEGORIES.includes(category);
}

export function isCrateSaleCategory(category: ProductCategory): boolean {
  return CRATE_SALE_CATEGORIES.includes(category);
}
