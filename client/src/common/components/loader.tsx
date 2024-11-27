import { CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";

function Loader({
  fixed = false,
  suspenseLoader = false,
  color = "secondary",
}: {
  fixed?: boolean;
  suspenseLoader?: boolean;
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
            : "fixed inset-0 bg-black bg-opacity-30 z-10 flex justify-center items-center"
          : "flex items-center justify-center"
      }
    >
      {suspenseLoader ? (
        <div className="flex h-[70vh] items-center justify-center">
          <div className="loader" />
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default Loader;
