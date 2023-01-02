import axios from "axios";
import  secureLocalStorage  from  "react-secure-storage";

export const baseURL = process.env.REACT_APP_API_BASE_URL;

const axiosConf = axios.create({
  baseURL,
});

axiosConf.defaults.headers.common[
  "Authorization"
] = `Bearer ${secureLocalStorage.getItem("accessToken")}`;

export default axiosConf;
