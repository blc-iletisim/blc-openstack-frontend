import ApplicationService from "../../../services/ApplicationService";
import  secureLocalStorage  from  "react-secure-storage";

export const createPem= (name) => {
  console.log("createPem name:", name);
  return async (dispatch) => {
    ApplicationService.http()
      .post("/pem/createPem", {},{
        params: {
          file_name: name,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + (await secureLocalStorage.getItem("accessToken")),
        },
      })
      .then((response) => {
        console.log("PEM Response: ",response.data)
        const pem = response.data;
        dispatch({
          type: "ADD_PEM",
          payload: {
            pem,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  
};


export const getPem = (user_id) => {
  console.log("selected user id", user_id);
  return async (dispatch) => {
    ApplicationService.http()
      .post("/pem/getPemsToUser", {},{
        params: {
          user_id: user_id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + (await secureLocalStorage.getItem("accessToken")),
        },
      })
      .then((response) => {
        console.log("pem Response: ",response.data)
        const pem = response.data;
        dispatch({
          type: "GET_PEM",
          payload: {
            pem,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};


export const uploadPem= (file) => {
console.log("files: ",file)
  return async (dispatch) => {
    ApplicationService.http()
      .post("/pem/uploadFile", file,{
      
        headers: {
          Accept: 'application/json',
          //'Content-Type': `multipart/form-data; boundary=${file.getBoundary()}`,
          //'Content-Type': `multipart/form-data`,
          //"Content-Type":  "multipart/form-data",
          Authorization:
            "Bearer " + (await secureLocalStorage.getItem("accessToken")),
        },
        
      })
      .then((response) => {
        console.log("uploadPEM Response: ",response.data)
        const pem = response.data;
        dispatch({
          type: "UPLOAD_PEM",
          payload: {
            pem,
          },
        });
      })
      .catch((error) => {
        console.log("error1", error);
      });
  };
  
};

