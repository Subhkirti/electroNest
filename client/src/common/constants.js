const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const mobileRegex = /^[6-9\b]+$/;
const emailIdRegex = /^\w+([\+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const pageSizes = [5, 10, 25, 50];

const carouselBreakpoints = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4.5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4.4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2.4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1.5,
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
