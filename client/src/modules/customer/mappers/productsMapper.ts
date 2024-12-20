import AppRoutes from "../../../common/appRoutes";
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
    productId: doc?.product_id || 0,
    productName: doc?.product_name || "",
    description: doc?.description || "",
    price: doc?.price || 0,
    netPrice: doc?.net_price || 0,
    discountPercentage: doc?.discount_percentage || 0,
    quantity: doc?.quantity || 0,
    brand: doc?.brand || "",
    color: doc?.color || "",
    size: doc?.size || "",
    path: doc?.product_id ? `/product/${doc?.product_id}` : AppRoutes.products,
    images: doc?.images.length ? JSON.parse(doc?.images) : [],
    categoryId: doc?.category_id || "",
    sectionId: doc?.section_id || "",
    itemId: doc?.item_id || "",
    createdAt: doc?.created_at || new Date(),
    updatedAt: doc?.updated_at || new Date(),
    stock: doc?.stock || 0,
    rating: doc?.rating || 0,
    reviews: doc?.reviews || [],
    isLiked: doc?.is_liked || false,
    warrantyInfo: doc?.warranty_info || "",
    returnPolicy: doc?.return_policy || "",
    deliveryCharges: doc?.delivery_charges || 0,
  };
}

function productsCarouselMap(doc: any) {
  return {
    category: topLevelCategoriesMap(doc?.category),
    products: doc?.products.map(productMap),
  };
}

export {
  topLevelCategoriesMap,
  secondLevelCategoriesMap,
  thirdLevelCategoriesMap,
  productMap,
  categoriesMap,
  productsCarouselMap,
};
