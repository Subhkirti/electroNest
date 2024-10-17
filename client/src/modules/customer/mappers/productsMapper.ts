import {
  Product,
  SecondLevelCategories,
  ThirdLevelCategories,
  TopLevelCategories,
} from "../types/productTypes";

function topLevelCategoriesMap(doc: any): TopLevelCategories {
  return {
    categoryId: doc?.category_id,
    categoryName: doc?.category_name,
    createdAt: doc?.created_at,
  };
}

function secondLevelCategoriesMap(doc: any): SecondLevelCategories {
  return {
    sectionId: doc?.section_id,
    sectionName: doc?.section_name,
    categoryId: doc?.category_id,
    createdAt: doc?.created_at,
  };
}

function thirdLevelCategoriesMap(doc: any): ThirdLevelCategories {
  return {
    sectionId: doc?.section_id,
    itemId: doc?.item_id,
    itemName: doc?.item_name,
    createdAt: doc?.created_at,
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
    productImage: doc?.product_image,
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
};
