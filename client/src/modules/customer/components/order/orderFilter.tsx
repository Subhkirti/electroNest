import { useNavigate } from "react-router-dom";
import { orderStatuses } from "../../utils/productUtils";
import ProductTotalCount from "../product/productTotalCount";

function OrderFilter({
  statusValues,
  totalCount,
}: {
  statusValues: string[];
  totalCount: number;
}) {
  const navigate = useNavigate();

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
    <div className="h-auto border rounded-md bg-white p-5 sticky top-5">
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
  );
}

export default OrderFilter;
