import ApplicationService from "../../../services/ApplicationService";

export const getImages = () => {
  return async (dispatch) => {
    ApplicationService.http()
      .post(
        "/graphql",{
          query:`
    
                        
              {
                images {
                  id
                  name
                  createdDateTime
                  updatedDateTime
                  deletedDateTime
                }
              }

              
              
          `,
        },{
          headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
          
        }    
      )
      .then((response) => {
        console.log("getImages response: ",response)
        const images = response.data.data.images;
        dispatch({
          type: "GET_IMAGES",
          payload: {
            images,
          },
        });
      });
  };
};