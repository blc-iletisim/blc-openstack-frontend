import ApplicationService from "../../../services/ApplicationService";
import  secureLocalStorage  from  "react-secure-storage";

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
          headers:{Authorization:'Bearer '+ secureLocalStorage.getItem('accessToken')}
          
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