import { registerSuccess } from "../store/auth/action";
import store from "../store/store";

const userKey = "user";
const storeData = store.getState()?.auth;

// if users data is not present in local-storage then get it from store
function getCurrentUser() {
  const user = localStorage.getItem(userKey) || storeData?.user;
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(userData: any) {
  const prevUserDetails = getCurrentUser();
  const mergedDetails = prevUserDetails
    ? JSON.stringify({ ...prevUserDetails, ...userData })
    : JSON.stringify(userData);

  // set the updated data in store and local-storage also
  store?.dispatch(registerSuccess(mergedDetails));
  localStorage.setItem(userKey, mergedDetails);
}

export { getCurrentUser, setCurrentUser };
