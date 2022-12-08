import axiosConf, {baseURL} from "../configs/@axios";
import axios from "axios";

class ApplicationService {
  get url() {
    return process.env.REACT_APP_API_BASE_URL;
  };

  get webSocketUrl() {
    return process.env.REACT_APP_API_WEBSOCKET_BASE_URL;
  };

  http = () => {
    return axiosConf;
  };

  httpWithoutAuthorization = () => {
    return axios.create({
      baseURL,
    });
  }

  get = (url) => {
    return new Promise((resolve, reject) => {
      return this.http()
        .get(url)
        .then((data) => {
          resolve(data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  post = (url, data, config) => {
    return new Promise((resolve, reject) => {
      return this.http()
        .post(url, data, config)
        .then((data) => {
          resolve(data.data);
          console.log("dataaa: ",data.data);
        })
        .catch((err) => {
          reject("error" + err);
        });
    });
  };

  put = (url, data, config) => {
    return new Promise((resolve, reject) => {
      return this.http()
        .put(url, data, config)
        .then((data) => {
          resolve(data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  delete = (url) => {
    return new Promise((resolve, reject) => {
      return this.http()
        .delete(url)
        .then((data) => {
          resolve(data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}

const instance = new ApplicationService();
export default instance;
