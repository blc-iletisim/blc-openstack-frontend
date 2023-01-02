import ApplicationService from "../../../services/ApplicationService";
import  secureLocalStorage  from  "react-secure-storage";

export const getFlavors = () => {
  return async (dispatch) => {
    ApplicationService.http()
      .post(
        "/graphql",{
          query:`
    
            {
              flavors {
                id
                name
                cpu_size
                ram_size
                root_disk
              }
            }

              
              
          `,
        },{
          headers:{Authorization:'Bearer '+ secureLocalStorage.getItem('accessToken')}
          
        }    
      )
      .then((response) => {
        console.log("getFlavors response: ",response)
        const flavors = response.data.data?.flavors;
        dispatch({
          type: "GET_FLAVORS",
          payload: {
            flavors,
          },
        });
      });
  };
};