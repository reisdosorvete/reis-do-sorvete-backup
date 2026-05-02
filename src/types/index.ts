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
  | 'picoles'
  | 'sorvetes'
  | 'acai'
  | 'secos'
  | 'extras'
  | 'copinho'
  | 'sundae'
  | 'seletto';

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
  createdAt: Date;
}

export type Store = 'morretes' | 'meia_praia' | 'pereque' | 'centro';

export type OrderStatus = 'criado' | 'separado' | 'entregue';

export interface OrderItem {
  productId: string;
  productName: string;
  productCode: string;
  unitsPerBox: number; 
  boxesPerCrate: number; 
  unitsPerCrate: number; 
  unitPrice: number;
  boxes: number; 
  totalUnits: number; 
  crates: number; 
  remainingBoxes: number; 
  looseUnits: number; 
  isLoose?: boolean; 
  isCrate?: boolean; 
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
  'picoles': 'Picolés',
  'sorvetes': 'Sorvetes',
  'acai': 'Açaí',
  'secos': 'Produtos Secos',
  'extras': 'Extras',
  'copinho': 'Copinho',
  'sundae': 'Sundae',
  'seletto': 'Seletto',
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

export const CATEGORY_GROUPS: Record<string, ProductCategory[]> = {
  picoles: ['picoles'],
  sorvetes: ['sorvetes'],
  acai: ['acai'],
  secos: ['secos'],
  extras: ['extras'],
  premium: ['copinho', 'sundae', 'seletto'],
};

export const CATEGORY_GROUP_NAMES: Record<string, string> = {
  picoles: 'Picolés',
  sorvetes: 'Sorvetes',
  acai: 'Açaí',
  secos: 'Produtos Secos',
  extras: 'Extras',
  premium: 'Copinhos & Sundaes',
};

export const DUAL_SALE_CATEGORIES: ProductCategory[] = [
  'picoles', 
  'secos', 
  'extras', 
  'copinho', 
  'sundae', 
  'seletto'
];

export const CRATE_SALE_CATEGORIES: ProductCategory[] = [
  'sorvetes',
  'acai'
];

export function isDualSaleCategory(category: ProductCategory): boolean {
  return DUAL_SALE_CATEGORIES.includes(category);
}

export function isCrateSaleCategory(category: ProductCategory): boolean {
  return CRATE_SALE_CATEGORIES.includes(category);
}