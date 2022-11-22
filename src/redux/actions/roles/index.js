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


  export const addRoles= (role) => {
  
    
    return async (dispatch) => { 
     
      ApplicationService.http()
        .post(
          "/graphql",
         {
          query:`
          mutation {
            createRole(input: { name: "`+role.name+`",permissions:[${role.roles}] }) {
              id
              name
              permissions {
                id
                name
             
       
              }
              
            }
          }
          
          `
  
         },{
          headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
          
        }
        )
        .then((response) => {
          console.log("addResponse: ",response)
         
          dispatch({
            type: "ADD_ROLES",
            payload: {
              roles: response.data.data.createRole,
            },
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
  };
  

  export const deleteRoles = (roleId) => {
    console.log("delete user id: ", roleId);
    return async (dispatch) => {
      ApplicationService.http()
        .post("/graphql", {
          query:`
          
            mutation {
              deleteRole(id: "`+roleId+`")
            }

          `,
        },{
          headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
          
        })
        .then((response) => {
          console.log("DeleteResponse: ", response);
          console.log("roleId:",roleId);
          dispatch({
            type: "DELETE_ROLES",
            payload: {
              id: roleId,
            },
          });
        })
        .catch((error) => {
          console.log("error -- responsee", error);
        });
    };
  };


  export const updateRoles = (role) => {
    console.log("updateDevice: ",role);
   
 
    return async (dispatch) => {
      console.log(role);
      ApplicationService.http()
        .post(
          "/graphql",
         {
          query:`
          
            mutation {
              updateRole(id: "`+role.id+`", input: { name: "`+role.name+`",permissions:"`+role.roles+`" }) {
                id
                name
                permissions {
                  id
                  name
              
                }
                
                createdDateTime
                updatedDateTime
                deletedDateTime
              }
            }

          
          `
  
         },{
          headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
          
        }
        )
        .then((response) => {
          console.log("update response", response);
          dispatch({
            type: "UPDATE_ROLE",
            payload: {
              roles: response.data.data.roles,
            },
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
  };