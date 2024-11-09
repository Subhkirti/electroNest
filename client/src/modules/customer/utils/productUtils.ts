import AppRoutes from "../../../common/appRoutes";
import {
  CategoryBreadcrumbs,
  CategoryState,
  Product,
} from "../types/productTypes";

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
      { value: "1999-2999", label: "₹1999 to ₹2999" },
      { value: "2999-3999", label: "₹2999 to ₹3999" },
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
    options: [
      { value: "in_stock", label: "In Stock" },
      { value: "out_of_stock", label: "Out Of Stock" },
    ],
  },
];

const sortOptions = [
  {
    name: "Price: Low to High",
    href: "#",
    current: false,
    value: "low_to_high",
  },
  {
    name: "Price: High to Low",
    href: "#",
    current: false,
    value: "high_to_low",
  },
];

function loadCategoryBreadCrumbs(
  categories: CategoryState[],
  product: Product | null
) {
  const categoryBreadcrumbs: CategoryBreadcrumbs[] = [];
  if (categories?.length && product) {
    // Find the matching category
    const category = categories.find(
      (cat) => cat.categoryId === product?.categoryId
    );

    if (category) {
      categoryBreadcrumbs.push({
        category: category.categoryName || "",
        path: category.categoryId ? `/${category.categoryId}` : AppRoutes.home,
      });

      // Find the matching section
      const section = category.sections?.find(
        (sec: any) => sec.sectionId === product?.sectionId
      );

      if (section) {
        categoryBreadcrumbs.push({
          category: section.sectionName || "",
          path: section.sectionId
            ? `/${category.categoryId}/${section.sectionId}`
            : AppRoutes.home,
        });

        // Find the matching item
        const item = section.items?.find(
          (itm: any) => itm.itemId === product?.itemId
        );

        if (item) {
          categoryBreadcrumbs.push({
            category: item.itemName || "",
            path: item.itemId
              ? `/${category.categoryId}/${section.sectionId}/${item.itemId}`
              : AppRoutes.home,
          });
        }
      }
    }
  }
  return categoryBreadcrumbs;
}
export { productFilters, sortOptions, loadCategoryBreadCrumbs };
