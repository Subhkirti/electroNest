import { Button } from "@mui/material";
import AppStrings from "../appStrings";
import AppRoutes from "../appRoutes";
import AppIcons from "../appIcons";
import { Link } from "react-router-dom";

function NotFound({ message }: { message: string }) {
  return (
    <div className="flex flex-col justify-center space-y-4 items-center">
      <img
        width={300}
        src={AppIcons.imgProductNotFound}
        alt="product not found"
      />
      <p className=" text-slate-800 text-2xl font-semibold">{message}</p>
      <Link to={AppRoutes.home}>
        <Button
          variant="outlined"
          className="hover:bg-primary hover:text-white transition ease-in duration-400"
        >
          {AppStrings.goToHome}
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
