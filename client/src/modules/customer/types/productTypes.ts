interface ProductSearchReqBody {
  searchQuery?: string;
  categoryId: string;
  sectionId: string;
  itemId: string;
  pageNumber: number;
  pageSize: number;
  colors?: string[];
  minPrice?: number[];
  maxPrice?: number[];
  discount?: string[];
  stock?: string | null;
  sort?: string;
}

interface ProductReqBody {
  images: string[];
  brand: string;
  title: string;
  description: string;
  price: number | null;
  size: string | null;
  color: string | null;
  quantity: number | null;
  disPercentage: number | null;
  topLevelCategory: string;
  secondLevelCategory: string;
  thirdLevelCategory: string;
  stock: number;
  rating: number;
  reviews: Review[];
  warrantyInfo: string | null;
  returnPolicy: string | null;
  deliveryCharges: number;
}

interface TopLevelCategories {
  categoryId: string;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SecondLevelCategories {
  sectionId: string;
  sectionName: string;
  categoryId: string; //parent key
  createdAt: Date;
  updatedAt: Date;
}

interface ThirdLevelCategories {
  itemId: string;
  itemName: string;
  sectionId: string; //parent key
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  netPrice: number;
  discountPercentage: number;
  quantity: number;
  brand: string;
  color: string;
  path: string;
  size: string;
  images: string[];
  categoryId: string;
  sectionId: string;
  itemId: string;
  createdAt: Date;
  updatedAt: Date;
  stock: number;
  rating: number;
  reviews: Review[];
  isLiked: boolean;
  warrantyInfo: string | null;
  returnPolicy: string | null;
  deliveryCharges: number;
}

interface Review {
  rating: number;
  comment: string;
  date: Date;
  userName: string;
  userId: string;
}

export enum CategoryTypes {
  topLevelCategories = "topLevelCategories",
  secondLevelCategories = "secondLevelCategories",
  thirdLevelCategories = "thirdLevelCategories",
}

interface CategoryState {
  categoryName: string;
  sectionName: string;
  itemName: string;
  categoryId?: string;
  sectionId?: string;
  itemId?: string;
  sections?: any[];
}

interface CategoryBreadcrumbs {
  category: string;
  path: string;
}
export type {
  ProductSearchReqBody,
  ProductReqBody,
  TopLevelCategories,
  SecondLevelCategories,
  ThirdLevelCategories,
  Product,
  CategoryState,
  CategoryBreadcrumbs,
};
