import { NavigateFunction } from "react-router-dom";
import AppRoutes from "../../../common/appRoutes";
import { CategoryBreadcrumbs, CategoryState } from "../types/productTypes";

const productFilters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White" },
      { value: "black", label: "Black" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "yellow", label: "Yellow" },
    ],
  },
  {
    id: "price",
    name: "Price",
    options: [
      { value: "159-399", label: "₹159 to ₹399" },
      { value: "399-999", label: "₹399 to ₹999" },
      { value: "999-1999", label: "₹999 to ₹1999" },
      { value: "1999-4999", label: "₹1999 to ₹4999" },
      { value: "4999-9999", label: "₹4999 to ₹9999" },
      { value: "9999-49999", label: "₹9999 to ₹49999" },
    ],
  },
  {
    id: "discount",
    name: "Discount Range",
    options: [
      { value: "10", label: "10% and above" },
      { value: "20", label: "20% and above" },
      { value: "30", label: "30% and above" },
      { value: "40", label: "40% and above" },
      { value: "50", label: "50% and above" },
      { value: "60", label: "60% and above" },
      { value: "70", label: "70% and above" },
      { value: "80", label: "80% and above" },
    ],
  },
  {
    id: "availability",
    name: "Availability",
    singleSelection: true,
    options: [
      { value: "in_stock", label: "In Stock" },
      { value: "out_of_stock", label: "Out Of Stock" },
    ],
  },
];

const sortOptions = [
  {
    name: "Price: Low to High",
    value: "low_to_high",
  },
  {
    name: "Price: High to Low",
    value: "high_to_low",
  },
];

function loadCategoryBreadCrumbs(categories: CategoryState[], product: any) {
  const categoryBreadcrumbs: CategoryBreadcrumbs[] = [];
  if (categories?.length && product) {
    // Find the matching category
    const category = categories.find(
      (cat) => cat.categoryId === product?.categoryId
    );

    if (category) {
      categoryBreadcrumbs.push({
        category: category.categoryName || "",
        path: getCategoryPath({
          categoryId: category.categoryId || "",
          sectionId: "",
          itemId: "",
        }),
      });

      // Find the matching section
      const section = category.sections?.find(
        (sec: any) => sec.sectionId === product?.sectionId
      );

      if (section) {
        categoryBreadcrumbs.push({
          category: section.sectionName || "",
          path: getCategoryPath({
            categoryId: category.categoryId || "",
            sectionId: section.sectionId,
            itemId: "",
          }),
        });

        // Find the matching item
        const item = section.items?.find(
          (itm: any) => itm.itemId === product?.itemId
        );

        if (item) {
          categoryBreadcrumbs.push({
            category: item.itemName || "",
            path: getCategoryPath({
              categoryId: category.categoryId || "",
              sectionId: section.sectionId,
              itemId: item.itemId,
            }),
          });
        }
      }
    }
  }
  return categoryBreadcrumbs;
}

function getCheckoutStep() {
  const location = window.location;
  const querySearch = new URLSearchParams(location.search);
  const activeStep = parseInt(querySearch.get("step") || "1");
  return activeStep;
}

function getQuerySearch(param: string) {
  const querySearch = new URLSearchParams(window.location.search);
  const value = querySearch.get(param) || "";
  return value;
}

function getCategoryPath({
  categoryId,
  sectionId,
  itemId,
}: {
  categoryId: string;
  sectionId?: string;
  itemId?: string;
}) {
  if (categoryId && sectionId && itemId) {
    return `/products/${categoryId}/${sectionId}/${itemId}`;
  } else if (categoryId && sectionId) {
    return `/products/${categoryId}/${sectionId}`;
  } else if (categoryId) {
    return `/products/${categoryId}`;
  } else {
    return AppRoutes.products;
  }
}
export {
  productFilters,
  sortOptions,
  loadCategoryBreadCrumbs,
  getCheckoutStep,
  getQuerySearch,
  getCategoryPath,
};
