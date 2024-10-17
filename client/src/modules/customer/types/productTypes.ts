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

interface ProductReqBody {
  imageUrl: string;
  brand: string;
  title: string;
  description: string;
  price: number | null;
  size: string | null;
  color: string | null;
  quantity: number | null;
  disPercentage: number | null;
  disPrice: number | null;
  topLevelCategory: string;
  secondLevelCategory: string;
  thirdLevelCategory: string;
}

interface TopLevelCategories {
  categoryId: string;
  categoryName: string;
  createdAt: Date;
}

interface SecondLevelCategories {
  sectionId: string;
  sectionName: string;
  categoryId: string; //parent key
  createdAt: Date;
}

interface ThirdLevelCategories {
  itemId: string;
  itemName: string;
  sectionId: string; //parent key
  createdAt: Date;
}

interface Product {
  productId: number;
  productName: string;
  description: string;
  price: Float32Array;
  discountPrice: Float32Array;
  discountPercentage: Float32Array;
  quantity: number;
  brand: string;
  color: string;
  size: string;
  productImage: string;
  categoryId: string;
  sectionId: string;
  itemId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type {
  ProductSearchReqBody,
  ProductReqBody,
  TopLevelCategories,
  SecondLevelCategories,
  ThirdLevelCategories,
  Product,
};
