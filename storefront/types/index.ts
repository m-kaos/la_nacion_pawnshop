export interface Asset {
  id: string;
  preview: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  priceWithTax: number;
  currencyCode: string;
  stockLevel?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset?: Asset;
  assets?: Asset[];
  variants: ProductVariant[];
  collections?: Collection[];
}

export interface ProductListResponse {
  products: {
    items: Product[];
    totalItems: number;
  };
}

export interface ProductResponse {
  product: Product;
}
