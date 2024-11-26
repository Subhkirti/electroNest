import AppStrings from "../appStrings";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";

function ViewMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      key="view-more"
      className="px-5 py-2 bg-primary bg-opacity-15 rounded-full cursor-pointer group"
    >
      <p className="text-lg text-center font-semibold text-primary  transform group-hover:translate-x-1 transition-transform">
        {AppStrings.viewMore} <KeyboardDoubleArrowRight />
      </p>
    </div>
  );
}

export default ViewMoreButton;
