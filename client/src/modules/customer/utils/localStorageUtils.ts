import store from "../../../store/store";
import { User } from "../types/userTypes";

const userKey = "user";
const storeData = store.getState()?.auth;

// if users data is not present in local-storage then get it from store
function getCurrentUser(): User | null {
  const user = localStorage.getItem(userKey) || storeData?.user;
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(userData: User) {
  const prevUserDetails = getCurrentUser();
  const mergedDetails = prevUserDetails
    ? JSON.stringify({ ...prevUserDetails, ...userData })
    : JSON.stringify(userData);

  localStorage.setItem(userKey, mergedDetails);
}

export { getCurrentUser, setCurrentUser };
