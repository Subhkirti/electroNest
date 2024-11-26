function ProductTotalCount({ totalCount }: { totalCount: number }) {
  return (
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
    </div>
  );
}

export default ProductTotalCount;
