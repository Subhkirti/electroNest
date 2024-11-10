import React from "react";
import AppStrings from "../appStrings";
import { Button } from "@mui/material";

function ViewMoreButton({ onClick }: { onClick: () => void }) {
  return <Button variant="outlined" onClick={onClick}>{AppStrings.viewMore}</Button>;
}

export default ViewMoreButton;
