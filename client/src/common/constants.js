const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export { passwordRegEx, apiBaseUrl };
