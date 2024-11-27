import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AppIcons from "../appIcons";
import AppColors from "../appColors";
import AppStrings from "../appStrings";
import AdminAppRoutes from "../adminRoutes";
import AppRoutes from "../appRoutes";



const PageNotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminEnv = location.pathname.includes("/admin");

  return (
    <Box className="flex flex-col items-center justify-center text-center p-[20px]">
      <img src={AppIcons.img404} alt="Not Found" width="300" />
      <Typography
        variant="h4"
        className="my-4 font-bold"
        sx={{
          color: isAdminEnv ? AppColors.white : AppColors.black,
        }}
      >
        {AppStrings.oopsPageNotFound}
      </Typography>
      <Typography variant="body1" className="mb-[20px] text-gray-500">
        {AppStrings.pageNotExist}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          navigate(isAdminEnv ? AdminAppRoutes.dashboard : AppRoutes.home)
        }
      >
        {AppStrings.goToHome}
      </Button>
    </Box>
  );
};

export default PageNotFound;
