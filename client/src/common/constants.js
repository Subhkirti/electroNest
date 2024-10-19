const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const pageSizes = [5, 10, 25, 50];

export { passwordRegEx, apiBaseUrl, pageSizes };
