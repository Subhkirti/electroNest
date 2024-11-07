import {
  Product,
  SecondLevelCategories,
  ThirdLevelCategories,
  TopLevelCategories,
} from "../types/productTypes";

function categoriesMap(doc: any) {
  return {
    categoryId: doc?.id || "",
    categoryName: doc?.name || "",
    sections: doc?.sections.length ? doc?.sections.map(sectionsMap) : [],
  };
}

function sectionsMap(doc: any) {
  return {
    sectionId: doc?.id || "",
    sectionName: doc?.name || "",
    items: doc?.items.length ? doc.items.map(itemsMap) : [],
  };
}

function itemsMap(doc: any) {
  return {
    itemId: doc?.id || "",
    itemName: doc?.name || "",
  };
}

function topLevelCategoriesMap(doc: any): TopLevelCategories {
  return {
    categoryId: doc?.category_id,
    categoryName: doc?.category_name,
    createdAt: doc?.created_at,
    updatedAt: doc?.updated_at,
  };
}

function secondLevelCategoriesMap(doc: any): SecondLevelCategories {
  return {
    sectionId: doc?.section_id,
    sectionName: doc?.section_name,
    categoryId: doc?.category_id,
    createdAt: doc?.created_at,
    updatedAt: doc?.updated_at,
  };
}

function thirdLevelCategoriesMap(doc: any): ThirdLevelCategories {
  return {
    sectionId: doc?.section_id,
    itemId: doc?.item_id,
    itemName: doc?.item_name,
    createdAt: doc?.created_at,
    updatedAt: doc?.updated_at,
  };
}

function productMap(doc: any): Product {
  return {
    productId: doc?.product_id,
    productName: doc?.product_name,
    description: doc?.description,
    price: doc?.price,
    discountPrice: doc?.discount_price,
    discountPercentage: doc?.discount_percentage,
    quantity: doc?.quantity,
    brand: doc?.brand,
    color: doc?.color,
    size: doc?.size,
    thumbnail: JSON.parse(doc?.thumbnail),
    images: JSON.parse(doc?.images),
    categoryId: doc?.category_id,
    sectionId: doc?.section_id,
    itemId: doc?.item_id,
    createdAt: doc?.created_at,
    updatedAt: doc?.updated_at,
  };
}

export {
  topLevelCategoriesMap,
  secondLevelCategoriesMap,
  thirdLevelCategoriesMap,
  productMap,
  categoriesMap,
};
