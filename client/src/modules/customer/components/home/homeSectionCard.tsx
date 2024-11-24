import { useNavigate } from "react-router-dom";
import { Product } from "../../types/productTypes";
import { textTruncate } from "../../../admin/utils/productUtil";

function HomeSectionCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  return product?.productId ? (
    <div
      onClick={() => navigate(product.path)}
      className=" hover:border-gray-300 h-full border rounded-md w-[16rem] bg-white m-2 transition-all cursor-pointer"
    >
      <div className="aspect-w-1 aspect-h-1 flex justify-center my-4 hover:scale-105 transition-all duration-700 px-3">
        <img src={product?.images?.[0]} alt="" className="object-contain" />
      </div>

      <div className="px-4 py-2 w-full">
        <h3 className="text-lg font-medium text-gray-900">{product?.brand}</h3>
        <p className="mt-2text-sm text-gray-500">
          {textTruncate(product?.productName, 70)}
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default HomeSectionCard;
