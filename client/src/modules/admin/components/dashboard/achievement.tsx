import { Box, Button, Card, CardContent, CardHeader } from "@mui/material";
import AppStrings from "../../../../common/appStrings";
import AppIcons from "../../../../common/appIcons";

export default function Achievement() {
  return (
    <Card className="relative admin-card">
      <CardHeader title={AppStrings.shopWith}></CardHeader>
      <CardContent sx={{ mt: -3 }}>
        <Box className="flex items-end justify-between w-full">
          <Box>
            <p className="text-md font-normal">{AppStrings.congratulations}</p>
            <p className="my-2 text-xl font-medium text-lightpurple">420.8k</p>

            <Button
              size="medium"
              variant="contained"
              sx={{ backgroundColor: "#9f5eff" }}
            >
              {AppStrings.viewSales}
            </Button>
          </Box>
          <Box>
            <img src={AppIcons.imgTrophy} width={100} alt="trophy" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
