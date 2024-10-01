function OrderFilter() {
  const orderStatuses = [
    {
      label: "On the way",
      value: "on_the_way",
    },
    {
      label: "Delivered",
      value: "delivered",
    },
    {
      label: "Cancelled",
      value: "cancelled",
    },
    {
      label: "Returned",
      value: "returned",
    },
  ];
  
  return (
    <div className="h-auto shadow-md border rounded-md bg-white p-5 sticky top-5">
      <h1 className="font-bold text-lg">Filter</h1>

      <div className="space-y-4 mt-10">
        <h1 className="font-semibold">ORDER STATUS</h1>

        {orderStatuses.map((option) => {
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                defaultValue={option.value}
                className="h-4 w-4 cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />

              <label
                className="ml-3 text-sm text-gray-600"
                htmlFor={option.value}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderFilter;
