import HomeSectionCard from "./homeSectionCard";
import Carousel from "react-multi-carousel";
import { carouselBreakpoints } from "../../../../common/constants";
import { useNavigate } from "react-router-dom";
import { getCategoryPath } from "../../utils/productUtils";
import { Product } from "../../types/productTypes";
import ViewMoreButton from "../../../../common/components/viewMoreButton";

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
        {productsList.length > 10 && (
          <div className="h-full flex items-center">
            <ViewMoreButton
              onClick={() => {
                navigate(
                  getCategoryPath({
                    categoryId: productsList[0]?.categoryId,
                  })
                );
              }}
            />
          </div>
        )}
      </Carousel>
    </div>
  );
}

export default HomeSectionCarousel;
