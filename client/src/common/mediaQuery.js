import { useMediaQuery } from "@mui/material";

function useMobile() {
  return useMediaQuery("(max-width:480px)");
}
function useTablet() {
  return useMediaQuery("(max-width:1024px)");
}

function useSmallDesktop() {
  return useMediaQuery("(max-width:1280px)");
}

export { useMobile, useTablet, useSmallDesktop };
