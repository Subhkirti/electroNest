import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../../../store/customer/wishlist/action";
import AppColors from "../../../../common/appColors";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { toast } from "react-toastify";
import AppStrings from "../../../../common/appStrings";
import Loader from "../../../../common/components/loader";

function LikeButton({
  productId,
  isLiked,
  isProductDetail,
}: {
  productId: number;
  isLiked: boolean;
  isProductDetail?: boolean;
}) {
  const userId = getCurrentUser()?.id;
  const [isPinging, setIsPinging] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.wishlist);

  const handleClick = () => {
    if (!userId) return toast.info(AppStrings.registerYourselfFirst);
    setIsPinging(true);
    dispatch(addToWishlist(productId));

    // Remove the animate-ping class after the animation finishes
    setTimeout(() => {
      setIsPinging(false);
    }, 350);
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-2 right-2 font-bold text-sm bg-primary bg-opacity-10 rounded-[6px] p-[3px]"
    >
      {isLoading ? (
        <Loader color="primary" />
      ) : isLiked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={AppColors.primary}
          className={
            isProductDetail
              ? `size-9 ${isPinging ? "animate-ping" : ""}`
              : `size-6 ${isPinging ? "animate-ping" : ""}`
          }
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke={AppColors.primary}
          className={
            isProductDetail
              ? `size-9 ${isPinging ? "animate-ping" : ""}`
              : `size-6 ${isPinging ? "animate-ping" : ""}`
          }
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      )}
    </button>
  );
}

export default LikeButton;
