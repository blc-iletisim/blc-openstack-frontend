import ApplicationService from "../../../services/ApplicationService";
import { FormControlUnstyledContext } from "@mui/base";

export const getPermissions = () => {
    return async (dispatch) => {
      ApplicationService.http()
        .post(
          "/graphql",{
            query:`
           
            {
                permissions{
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
          console.log("getPermissions response: ",response)
          const permissions = response.data.data.permissions;
          dispatch({
            type: "GET_PERMISSIONS",
            payload: {
              permissions,
            },
          });
        });
    };
  };