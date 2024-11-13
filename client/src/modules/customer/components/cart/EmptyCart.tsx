import AppIcons from "../../../../common/appIcons";
import AppRoutes from "../../../../common/appRoutes";
import AppStrings from "../../../../common/appStrings";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col space-y-1 justify-center items-center">
      <img src={AppIcons.imgEmptyCart} alt="" />
      <p className="text-2xl font-bold pt-10">{AppStrings.cartIsEmpty}</p>
      <p className="pb-4 text-center">{AppStrings.justRelaxFindProducts}</p>
      <Button onClick={() => navigate(AppRoutes.products)} variant="contained">
        {AppStrings.startShopping}
      </Button>
    </div>
  );
}

export default EmptyCart;
