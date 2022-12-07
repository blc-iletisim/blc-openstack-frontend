import ApplicationService from "../../../services/ApplicationService";

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
            "Bearer " + (await localStorage.getItem("accessToken")),
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
            "Bearer " + (await localStorage.getItem("accessToken")),
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
  console.log("uploadPem:", file);
  let formData = new FormData();
  //const formData = new FormData();
/*   formData.append('file', {
    uri: "path",
    name: Math.random() + ('image.jpg'),
    type: 'image/jpeg',
  }); */
 //formData.append('file',file)


 //formData.append('data', file, { filename : 'document.pem' });

/*  formData.append('file', Buffer.from(file), {
  filename: 'image1.jpg', 
  filepath: 'photos/image1.jpg',
  contentType: 'image/jpeg',
  knownLength: 19803
});
 */
 /* formData.append('file', {
 
  uri: "ath",
  name: Math.random() + ('image.jpg'),
  type: 'image/jpeg',
}); */
formData.append("file", file);
//formData.append('file', file);
//formData.append('file', file.File);
var options = { content: formData };
  console.log("formData: ",formData)
  console.log("options: ", options);
  


//formData boş geliyor buna çevirmede problem olabilir 

  /* const formData = new FormData();
  formData.append('fileUpload', file); */
  return async (dispatch) => {
    ApplicationService.http()
      .post("/pem/uploadFile", {},{
        params: {
          //file:file
        file:formData
          //file: options.content,
        },
        headers: {
          //"Content-Type": "application/x-www-form-urlencoded",
         //"Content-Type": "application/json",
         "Content-Type": "multipart/form-data",
         //'content-type': 'multipart/form-data',
          Authorization:
            "Bearer " + (await localStorage.getItem("accessToken")),
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
        console.log("error", error);
      });
  };
  
};

