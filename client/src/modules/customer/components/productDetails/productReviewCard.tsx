import { Avatar, Box, Grid, Rating } from "@mui/material";

function ProductReviewCard() {
  return (
    <Grid container spacing={2} gap={3}>
      <Grid item xs={1}>
        <Box>
          <Avatar
            className="text-white"
            sx={{ width: 56, height: 56, bgcolor: " #9155fd" }}
          >
            R
          </Avatar>
        </Box>
      </Grid>

      <Grid item xs={9}>
        <div className="space-y-2">
          <div>
            <p className="text-semibold text-lg">Ram</p>
            <p className="opacity-70">April 7, 2023</p>
          </div>
        </div>
        <Rating value={4.5} name="half-rating" />
        <p>Nice Product, I loved it.</p>
      </Grid>
    </Grid>
  );
}

export default ProductReviewCard;
