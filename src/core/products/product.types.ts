export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  scoville: number | null;
  stock: number;
  created_at: string;
  product_type?: string | null;
  is_hidden?: boolean;
}

export interface ProductsResponse {
  data: Product[];
  message: string;
}

export interface ProductResponse {
  data: Product;
  message: string;
}

export interface ProductWriteBody {
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  scoville: number | null;
  stock: number;
  product_type: string | null;
}

export interface ProductWriteResponse {
  product: Product;
  message: string;
}
