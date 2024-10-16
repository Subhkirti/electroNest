import { MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import AppStrings from "../../../../common/appStrings";
import { salesData } from "../../utils/dashboardUtil";

export default function MonthlyOverview() {
  return (
    <Card className="admin-card">
      <CardHeader
        title={AppStrings.monthlyOverview}
        action={
          <IconButton size="small">
            <MoreVert sx={{ color: "white" }} />
          </IconButton>
        }
        subheader={
          <Typography variant="body2">
            <Box component={"span"} sx={{ fontWeight: 600 }}>
              Total 48.5% growth{" "}
            </Box>
            this month
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 3.2,
            lineHeight: "2rem !important",
            letterSpacing: ".15px !important",
          },
        }}
      />
      <CardContent sx={{ pt: "3px !important" }}>
        <Grid container spacing={[5, 0]}>
          <RenderStats />
        </Grid>
      </CardContent>
    </Card>
  );
}

function RenderStats() {
  return (
    <>
      {salesData.map((item, index) => (
        <Grid item xs={12} sm={3} key={index}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              variant="rounded"
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: "white",
                background: item.color,
              }}
            >
              {<item.icon className="font-[1.75rem]" />}
            </Avatar>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="caption">{item.title}</Typography>
              <Typography variant="h6">{item.stats}</Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </>
  );
}
