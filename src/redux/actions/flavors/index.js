import ApplicationService from "../../../services/ApplicationService";

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
          headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
          
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