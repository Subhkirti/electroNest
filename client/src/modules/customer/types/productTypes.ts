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
  price: number;
  quantity: number;
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
export type {
  ProductSearchReqBody,
  ProductReqBody,
  TopLevelCategories,
  SecondLevelCategories,
  ThirdLevelCategories,
};
