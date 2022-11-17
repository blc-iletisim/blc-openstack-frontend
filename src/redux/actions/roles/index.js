import ApplicationService from "../../../services/ApplicationService";
import { FormControlUnstyledContext } from "@mui/base";

export const getRoles = () => {
    return async (dispatch) => {
      ApplicationService.http()
        .post(
          "/graphql",{
            query:`
           
                
                {
                  roles {
                    id
                    name
                    permissions {
                      id
                      name

                  
                    }
                  

                  }
                }


  
            `,
          },{
            headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
            
          }    
        )
        .then((response) => {
          console.log("getRoles response: ",response)
          const roles = response.data.data.roles;
          dispatch({
            type: "GET_ROLES",
            payload: {
              roles,
            },
          });
        });
    };
  };