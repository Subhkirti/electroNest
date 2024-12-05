import { Box, Button, Card, CardContent, CardHeader } from "@mui/material";
import AppStrings from "../../../../common/appStrings";
import AppIcons from "../../../../common/appIcons";
import AppColors from "../../../../common/appColors";
import { Link } from "react-router-dom";
import AppRoutes from "../../../../common/appRoutes";

export default function Achievement() {
  return (
    <Card className="relative admin-card">
      <CardHeader title={AppStrings.shopWith}></CardHeader>
      <CardContent sx={{ mt: -3 }}>
        <Box className="flex items-end justify-between w-full">
          <Box>
            <p className="text-md font-normal">{AppStrings.congratulations}</p>
            <p className="my-2 text-xl font-medium text-lightpurple">420.8k</p>
            <Link to={AppRoutes.home}>
              <Button
                size="medium"
                variant="contained"
                sx={{ backgroundColor: AppColors.lightPurple }}
              >
                {AppStrings.viewSales}
              </Button>
            </Link>
          </Box>
          <Box>
            <img src={AppIcons.imgTrophy} width={100} alt="trophy" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
