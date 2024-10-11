interface ProductReqBody {
  pageNumber: number;
  pageSize: number;
  colors: string;
  minPrice: number;
  maxPrice: number;
  discount: string;
  category: string;
  stock: string | null;
  sort: string;
}

export type { ProductReqBody };
