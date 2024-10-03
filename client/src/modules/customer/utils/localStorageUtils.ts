const userKey = "user";

function getCurrentUser() {
  const user = localStorage.getItem(userKey);
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(userData: any) {
  const prevUserDetails = getCurrentUser();
  localStorage.setItem(
    userKey,
    prevUserDetails
      ? JSON.stringify({ ...prevUserDetails, ...userData })
      : JSON.stringify(userData)
  );
}

export { getCurrentUser, setCurrentUser };
