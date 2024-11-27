import { mainCarouselData } from "../../utils/homeUtils";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";

const MainCarousel = () => {
  const navigate = useNavigate();

  return (
    <Carousel
      responsive={{
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 1,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 1,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
        },
      }}
      slidesToSlide={1}
      autoPlay={true}
      autoPlaySpeed={2000}
      transitionDuration={1000}
      infinite
      className="pb-10 -mt-10"
      dotListClass="carousel-dots"
      showDots={true}
      arrows={true}
    >
      {mainCarouselData.map((carousel, index) => (
        <img
          src={carousel.image}
          role="presentation"
          key={index}
          alt=""
          className="w-screen aspect-h-1 lg:h-[600px] object-fill cursor-pointer"
          onClick={() => navigate(carousel.path)}
        />
      ))}
    </Carousel>
  );
};

export default MainCarousel;
