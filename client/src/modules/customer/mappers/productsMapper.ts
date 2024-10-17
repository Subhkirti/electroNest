import {
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
export {
  topLevelCategoriesMap,
  secondLevelCategoriesMap,
  thirdLevelCategoriesMap,
};
