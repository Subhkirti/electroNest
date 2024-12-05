const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const mobileRegex = /^[6-9\b]+$/;
const emailIdRegex = /^\w+([\+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const pageSizes = [5, 10, 20, 30, 50];

const carouselBreakpoints = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4.5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1240 },
    items: 4.4,
  },
  tablet: {
    breakpoint: { max: 1240, min: 764 },
    items: 3.2,
  },
  mobile: {
    breakpoint: { max: 764, min: 450 },
    items: 2.3,
  },
  extraSmall: {
    breakpoint: { max: 450, min: 0 },
    items: 1,
  },
};
export {
  passwordRegEx,
  apiBaseUrl,
  pageSizes,
  mobileRegex,
  emailIdRegex,
  carouselBreakpoints,
};
