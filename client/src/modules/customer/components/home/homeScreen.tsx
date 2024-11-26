import { useEffect } from "react";
import MainCarousel from "./mainCarousel";
import Footer from "../footer/footer";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../common/appRoutes";
import HomeSectionCarousel from "./homeSectionCarousel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getHomeProductsCarousel } from "../../../../store/customer/product/action";
import ViewMoreButton from "../../../../common/components/viewMoreButton";
import Loader from "../../../../common/components/loader";

function HomeScreen() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { productsCarousel } = useSelector((state: RootState) => state.product);
  const { logoutLoader } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) navigate(AppRoutes.home);
    const timer = setTimeout(() => {
      !productsCarousel.length && dispatch(getHomeProductsCarousel());
    }, 10);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, []);

  return logoutLoader ? (
    <Loader suspenseLoader={true} />
  ) : (
    <div className="absolute left-0 right-0">
      <MainCarousel />

      <div className="space-y-10 py-8 flex flex-col justify-center container">
        {productsCarousel.map((carousel, index) => {
          return (
            carousel.products.length > 0 && (
              <HomeSectionCarousel
                key={index}
                productsList={carousel.products}
                sectionName={carousel.category.categoryName}
              />
            )
          );
        })}
      </div>
      <div className="flex justify-center">
        <ViewMoreButton
          onClick={() => {
            navigate(AppRoutes.products);
          }}
        />
      </div>
      <Footer />
    </div>
  );
}

export default HomeScreen;
