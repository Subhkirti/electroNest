import { CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";

function Loader({
  fixed = false,
  color = "secondary",
}: {
  fixed?: boolean;
  color?: "primary" | "secondary";
}) {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes("admin");
  return (
    <div

      className={
        fixed
          ? isAdminRoute
            ? "fixed inset-0 bg-black opacity-75 z-10 flex justify-center items-center"
            : "fixed inset-0 bg-neutral-700 z-10 flex justify-center items-center"
          : "flex items-center justify-center"
      }
    >
      <CircularProgress
        size={"30px"}
        style={{
          color: isAdminRoute
            ? "white"
            : color === "primary"
            ? "primary"
            : "white",
        }}
      />
    </div>
  );
}

export default Loader;
