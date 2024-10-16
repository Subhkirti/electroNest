import { useNavigate } from "react-router-dom";

function HomeSectionCard({ product }: { product: any }) {
  const navigate = useNavigate();
  return (
    product?.id && (
      <div
        onClick={() => navigate(`/product/${product?.id}`)}
        className="cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-[15rem] mx-3 border"
      >
        <div className="h-[13rem] w-[10rem]">
          <img
            className="object-cover object-top w-full h-full"
            src={product?.thumbnail}
            alt={product?.id}
          />
        </div>

        <div className="p-4 w-full">
          <h3 className="text-lg font-medium text-gray-900">
            {product?.brand}
          </h3>
          <p className="mt-2text-sm text-gray-500">{product?.title}</p>
        </div>
      </div>
    )
  );
}

export default HomeSectionCard;
