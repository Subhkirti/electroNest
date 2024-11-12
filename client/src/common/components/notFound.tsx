import { Button } from "@mui/material";
import AppStrings from "../appStrings";
import AppRoutes from "../appRoutes";
import AppIcons from "../appIcons";
import { useNavigate } from "react-router-dom";

function NotFound({
  message,
  isGoBack,
}: {
  message: string;
  isGoBack?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center space-y-4 items-center">
      <img
        width={300}
        src={AppIcons.imgProductNotFound}
        alt="product not found"
      />
      <p className=" text-slate-800 text-2xl font-semibold">{message}</p>
      <Button
        onClick={() => (isGoBack ? navigate(-1) : navigate(AppRoutes.home))}
        variant="outlined"
        className="hover:bg-primary hover:text-white transition ease-in duration-400"
      >
        {isGoBack ? AppStrings.goBack : AppStrings.goToHome}
      </Button>
    </div>
  );
}

export default NotFound;
