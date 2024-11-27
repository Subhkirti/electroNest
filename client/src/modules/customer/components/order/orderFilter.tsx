import { useNavigate } from "react-router-dom";
import { orderStatuses } from "../../utils/productUtils";
import ProductTotalCount from "../product/productTotalCount";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

function OrderFilter({
  statusValues,
  totalCount,
}: {
  statusValues: string[];
  totalCount: number;
}) {
  const navigate = useNavigate();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  function handleOnSearchFilter(
    value: string,
    sectionId: string,
    singleSelection?: boolean
  ) {
    const searchParams = new URLSearchParams(window.location.search);
    if (singleSelection) {
      // For single-selection sections, replace the existing value with the new one
      searchParams.set(sectionId, value);
    } else {
      // For multi-selection sections, add or remove the value
      let filterValue = searchParams.getAll(sectionId);

      if (
        filterValue?.length > 0 &&
        filterValue[0]?.split(",").includes(value)
      ) {
        // Remove the value if it already exists
        filterValue = filterValue[0]
          ?.split(",")
          ?.filter((item) => item !== value);

        if (filterValue?.length === 0) {
          searchParams.delete(sectionId);
        }
      } else {
        filterValue.push(value);
      }

      if (filterValue?.length > 0) {
        searchParams.set(sectionId, filterValue.join(","));
      }
    }

    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  }
  return (
    <>
      {/* mobile filter section starts here */}
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
            <form className="mt-4 border-t border-gray-200 space-y-5 p-4">
              {orderStatuses.map((option) => {
                return (
                  <div className="flex items-center">
                    <input
                      onChange={() =>
                        handleOnSearchFilter(option.value, "status")
                      }
                      type="checkbox"
                      checked={statusValues.includes(option.value)}
                      defaultValue={option.value}
                      className="h-4 w-4 cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    <label
                      className="ml-3 text-sm text-gray-600 flex space-x-2 items-center"
                      htmlFor={option.value}
                    >
                      <img
                        src={option?.icon}
                        width={20}
                        alt="order-status-icon"
                      />

                      <span>{option.label}</span>
                    </label>
                  </div>
                );
              })}
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      <div className="flex w-full items-center space-x-8 lg:hidden mb-10">
        <ProductTotalCount
          totalCount={totalCount}
          onClick={() => setMobileFiltersOpen(true)}
        />
      </div>

      {/* mobile filter section ends here */}

      <div className="h-auto border rounded-md bg-white p-5 hidden lg:block">
        {/* Mobile filter dialog */}

        <ProductTotalCount totalCount={totalCount} />

        <div className="space-y-4 mt-5">
          <h1 className="font-semibold">ORDER STATUS</h1>

          {orderStatuses.map((option) => {
            return (
              <div className="flex items-center">
                <input
                  onChange={() => handleOnSearchFilter(option.value, "status")}
                  type="checkbox"
                  checked={statusValues.includes(option.value)}
                  defaultValue={option.value}
                  className="h-4 w-4 cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />

                <label
                  className="ml-3 text-sm text-gray-600 flex space-x-2 items-center"
                  htmlFor={option.value}
                >
                  <img src={option?.icon} width={20} alt="order-status-icon" />

                  <span>{option.label}</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default OrderFilter;
