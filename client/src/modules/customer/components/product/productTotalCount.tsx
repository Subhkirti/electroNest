import { FunnelIcon } from "@heroicons/react/24/outline";
import { FilterAltOff } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProductTotalCount({
  totalCount,
  onClick,
}: {
  totalCount: number;
  onClick?: () => void;
}) {
  const navigate = useNavigate();
  const queryString = decodeURIComponent(window.location.search);
  const searchParams = new URLSearchParams(queryString);

  function clearFilters() {
    navigate(window.location.pathname, { replace: true });
  }
  return (
    <div className="flex w-full justify-between py-4 border-b">
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
      <>
        {searchParams?.size > 0 ? (
          <Tooltip title="Clear Filters">
            <FilterAltOff className="cursor-pointer" onClick={clearFilters} />
          </Tooltip>
        ) : (
          <Tooltip title="Filters">
            <FunnelIcon
              aria-hidden="true"
              className="h-5 w-5 lg:hidden"
              onClick={onClick}
            />
          </Tooltip>
        )}
      </>
    </div>
  );
}

export default ProductTotalCount;
