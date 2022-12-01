import ApplicationService from "../../../services/ApplicationService";
export const createPem= (name) => {
  console.log("createPem name:", name);
  return async (dispatch) => {
    ApplicationService.http()
      .post("/pem/createPem", {},{
        params: {
            name: name,
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

