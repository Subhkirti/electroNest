import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { mainCarouselData } from "../../utils/homeUtils";
import { useNavigate } from "react-router-dom";

const MainCarousel = () => {
  const navigate = useNavigate();

  const items = mainCarouselData.map((carousel, index) => (
    <img
      src={carousel.image}
      role="presentation"
      key={index}
      alt=""
      className="w-screen h-auto lg:h-[400px] object-fill cursor-pointer"
      onClick={() => navigate(carousel.path)}
    />
  ));

  return (
    <AliceCarousel
      mouseTracking
      disableButtonsControls
      autoPlay
      items={items}
      controlsStrategy="alternate"
      autoPlayInterval={1000}
      infinite
    />
  );
};

export default MainCarousel;
