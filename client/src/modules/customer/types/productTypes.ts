interface ProductSearchReqBody {
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

type ProductReqBody = {
  imageUrl: string;
  brand: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  disPercentage: number | null;
  disPrice: number | null;
  topLevelCategory: string;
  secondLevelCategory: string;
  thirdLevelCategory: string;
};

export type { ProductSearchReqBody, ProductReqBody };
