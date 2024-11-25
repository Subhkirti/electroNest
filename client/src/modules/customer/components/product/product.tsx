import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import ProductCard from "./productCard";
import {
  loadCategoryBreadCrumbs,
  productFilters,
  sortOptions,
} from "../../utils/productUtils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { findProducts } from "../../../../store/customer/product/action";
import {
  CategoryBreadcrumbs,
  ProductSearchReqBody,
} from "../../types/productTypes";
import Loader from "../../../../common/components/loader";
import AppStrings from "../../../../common/appStrings";
import NotFound from "../../../../common/components/notFound";
import { FilterAltOff } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import Breadcrumbs from "../productDetails/breadcrumbs";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, products, totalCount, categories } = useSelector(
    (state: RootState) => state.product
  );
  const params = useParams();
  const queryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(queryString);
  const queryValue = searchParams.get("query") || "";
  const colorValue = searchParams.get("color")?.split(",");
  const priceValue = searchParams.get("price");
  const discountValue = searchParams.get("discount")?.split(",");
  const sortValue = searchParams.get("sort");
  const pageNumber = searchParams.get("page");
  const stockValue = searchParams.get("stock");
  const [categoryBreadcrumbs, setCategoryBreadcrumbs] = useState<
    CategoryBreadcrumbs[]
  >([]);
  const minMaxPrices = priceValue
    ? priceValue
        .split(",")
        .map((priceRange) => priceRange.split("-").map(Number))
    : [];

  const minPriceList = minMaxPrices.map(([min, max]) => min);
  const maxPriceList = minMaxPrices.map(([min, max]) => max);

  useEffect(() => {
    const reqData: ProductSearchReqBody = {
      categoryId: params?.categoryId || "",
      sectionId: params?.sectionId || "",
      itemId: params?.itemId || "",
      colors: colorValue || [],
      minPrice: minPriceList,
      maxPrice: maxPriceList,
      discount: discountValue || [],
      sort: sortValue || "low_to_high",
      pageNumber: pageNumber ? parseInt(pageNumber) - 1 : 1,
      pageSize: 10,
      stock: stockValue,
      searchQuery: queryValue,
    };

    const timer = setTimeout(() => {
      dispatch(findProducts(reqData));
    }, 10);

    return () => {
      clearTimeout(timer);
    };

    // eslint-disable-next-line
  }, [
    params,
    colorValue?.length,
    priceValue?.length,
    discountValue?.length,
    sortValue,
    pageNumber,
    stockValue,
  ]);

  useEffect(() => {
    // Fetch category breadcrumbs
    categories?.length &&
      setCategoryBreadcrumbs(
        loadCategoryBreadCrumbs(categories, {
          categoryId: params?.categoryId,
          sectionId: params?.sectionId,
          itemId: params?.itemId,
        })
      );
    // eslint-disable-next-line
  }, [categories]);

  function handleOnSearchFilter(value: string, sectionId: string) {
    const searchParams = new URLSearchParams(location.search);
    let filterValue = searchParams.getAll(sectionId);

    if (filterValue?.length > 0 && filterValue[0]?.split(",").includes(value)) {
      // eslint-disable-next-line
      filterValue = filterValue[0]?.split(",")?.filter((item) => item != value);

      if (filterValue?.length === 0) {
        searchParams.delete(sectionId);
      }
    } else {
      filterValue.push(value);
    }

    if (filterValue?.length > 0) {
      searchParams.set(sectionId, filterValue.join(","));
      const query = searchParams.toString();
      navigate({ search: `?${query}` });
    }
  }

  function clearFilters() {
    navigate(window.location.pathname, { replace: true });
  }
  const dataNotAvailable = !isLoading && products.length === 0;
  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              {/* Mobiles view Filters */}
              <form className="mt-4 border-t border-gray-200">
                {productFilters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              onChange={() =>
                                handleOnSearchFilter(option.value, section.id)
                              }
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="ml-3 min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
            {/* Category Breadcrumbs */}
            <Breadcrumbs categoryBreadcrumbs={categoryBreadcrumbs} />

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <a
                          href={option.href}
                          className={classNames(
                            option.current
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "block px-4 py-2 text-sm data-[focus]:bg-gray-100"
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <div className={"grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5"}>
              {/* Web Filters */}
              <form className="hidden lg:block">
                <div className="flex justify-between py-4 border-b border-black">
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold">Filters </p>
                    {totalCount > 0 && (
                      <p className="text-gray-500 text-[12px] bg-gray-200 px-2 rounded-lg">
                        {totalCount}
                        {totalCount > 1
                          ? totalCount > 100
                            ? "+ products"
                            : " products"
                          : " product"}
                      </p>
                    )}
                  </div>

                  {searchParams?.size > 0 && (
                    <Tooltip title="Clear Filters">
                      <FilterAltOff
                        className="cursor-pointer"
                        onClick={clearFilters}
                      />
                    </Tooltip>
                  )}
                </div>
                {productFilters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              onChange={() =>
                                handleOnSearchFilter(option.value, section.id)
                              }
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="ml-3 text-sm text-gray-600"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              <div className="lg:col-span-4 w-full">
                {dataNotAvailable ? (
                  <NotFound
                    message={AppStrings.productsNotFound}
                    isGoBack={true}
                  />
                ) : (
                  <div className="flex flex-wrap justify-start bg-white py-5">
                    {/* Products grid */}
                    {products.map((product, index) => {
                      return <ProductCard key={index} product={product} />;
                    })}
                  </div>
                )}
              </div>

              {isLoading && <Loader />}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
