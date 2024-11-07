const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const mobileRegex = /^[6-9\b]+$/;
const emailIdRegex = /^\w+([\+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const pageSizes = [5, 10, 25, 50];

export { passwordRegEx, apiBaseUrl, pageSizes, mobileRegex, emailIdRegex };
