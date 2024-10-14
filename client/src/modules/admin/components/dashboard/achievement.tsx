import { Button, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import AppStrings from "../../../../common/appStrings";
import AppIcons from "../../../../common/appIcons";

function Achievement() {
  return (
    <Card className="positive" sx={{ bgcolor: "#2c2c54", color: "white" }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ letterSpacing: ".25px", display: "flex" }}
        >
          {AppStrings.shopWith}
        </Typography>
        <p className="text-md font-normal">{AppStrings.congratulations}</p>
        <p className="my-2 text-xl font-semibold">420.8k</p>

        <Button size="small" variant="contained">
          {AppStrings.viewSales}
        </Button>
        <img src={AppIcons.imgTrophy} width={"600"} alt="trophy" />
      </CardContent>
    </Card>
  );
}

export default Achievement;
