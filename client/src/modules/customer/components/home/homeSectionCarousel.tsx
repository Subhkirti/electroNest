import HomeSectionCard from "./homeSectionCard";
import Carousel from "react-multi-carousel";
import { carouselBreakpoints } from "../../../../common/constants";
import AppStrings from "../../../../common/appStrings";
import { useNavigate } from "react-router-dom";
import { getCategoryPath } from "../../utils/productUtils";
import { Product } from "../../types/productTypes";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";

function HomeSectionCarousel({
  productsList,
  sectionName,
}: {
  productsList: Product[];
  sectionName: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-white">
      <h2 className="text-2xl font-extrabold text-gray-800 p-5 capitalize">
        {sectionName}
      </h2>

      <Carousel
        responsive={carouselBreakpoints}
        slidesToSlide={2}
        className="mb-10"
        arrows={true}
      >
        {productsList?.length > 0 &&
          productsList.map((product, index) => {
            return <HomeSectionCard product={product} key={index} />;
          })}
        {/* View More button */}
        {productsList.length > 4 && (
          <div className="h-full flex items-center">
            <div
              key="view-more"
              className="px-5 py-2 bg-blue-400 bg-opacity-15 rounded-full group"
            >
              <p
                onClick={() => {
                  navigate(
                    getCategoryPath({
                      categoryId: productsList[0]?.categoryId,
                    })
                  );
                }}
                className="text-lg text-center font-semibold text-blue-400 cursor-pointer transform group-hover:translate-x-1 transition-transform"
              >
                {AppStrings.viewMore} <KeyboardDoubleArrowRight />
              </p>
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );
}

export default HomeSectionCarousel;
