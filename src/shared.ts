export const authorizationHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: token } : {};
};
