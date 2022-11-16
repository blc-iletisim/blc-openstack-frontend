import axios from "axios";

export const baseURL = process.env.REACT_APP_API_BASE_URL;

const axiosConf = axios.create({
  baseURL,
});

axiosConf.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.getItem("accessToken")}`;

export default axiosConf;
