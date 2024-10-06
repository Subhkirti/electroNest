import { CircularProgress } from "@mui/material";

function Loader({
  fixed = false,
  color = "secondary",
}: {
  fixed?: boolean;
  color: "primary" | "secondary";
}) {
  return (
    <div className={fixed ? "fixed inset-0 bg-neutral-700" : ""}>
      <CircularProgress
        sx={{ color: color === "primary" ? "primary" : "white" }}
      />
    </div>
  );
}

export default Loader;
