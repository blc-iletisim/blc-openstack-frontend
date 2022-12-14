import { DateRange } from "@mui/icons-material";
import ApplicationService from "../../../services/ApplicationService";

export const getUsersHttp = () => {
  console.log("getUsers");
  return async (dispatch) => {
    ApplicationService.http()
      .post("/graphql", {
        query:`
        
            {
              users {
                id
                name
                email
                company {
                  id
                  name
                }
                role {
                  id
                  name
                }
                instances {
                  id
                  name
                  pemName
                }
                createdDateTime
                updatedDateTime
                deletedDateTime
              }
            }

          
        `,
      },{
        headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
        
      })
      .then((response) => {
        console.log("response: ",response);
        const users = response.data.data.users;
        dispatch({
          type: "GET_USERS",
          payload: {
            users,
          },
        });
      })
      .catch((error) => {
        console.log("error -- responsee", error);
      });
  };
};

export const addUser = (sender, data) => {
  console.log("addUser sender: ",sender);
  console.log("addUser data: ",data);
  
  return async (dispatch) => {
    console.log("dispatch: ",dispatch);
    ApplicationService.http()
      .post(
        "/graphql",{
          query:`


          mutation {
            createUser(input: { name: "`+data.name+`"
            email: "`+data.email+`"
            password: "`+data.password+`"
            company: "`+data.companyId+`"
            role:"`+data.roles+`"}) {
              id
              name
              email
              password
              company {
                id
                name
              }
              role {
                id
                name
              }
              instances {
                id
                name
                pemName
              }
              createdDateTime
              updatedDateTime
              deletedDateTime
            }
          }
          
          `,
        },{
          headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
          
        })
      .then((response) => {
        console.log("response", response);
        dispatch({
          type: "ADD_USER",
          payload: {
            data: response.data.data.createUser,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};

export const updateUser = (sender, data) => {
  console.log("UPDATE data: ", data);

  
  return async (dispatch) => {
    console.log("updateUser data: ",data);
    ApplicationService.http()
      .post("/graphql",
      {
        query:`

                    
            mutation {
              updateUser(id: "`+data.id+`", input: {company:"`+data.companyId+`",role:"`+data.roles+`",email:"`+data.email+`",name:"`+data.name+`",password:"`+data.password+`"}) {
                id
                name
                email
                password
                company {
                  id
                  name

                }
                role {
                  id
                  name
                
                }
                instances {
                  id
                  name
                  pemName
                
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
        console.log("updateUser response: ",response)
    
        let obj = {}
        
        dispatch({
          type: "UPDATE_USER",
          payload: {
            //user:response.data,
            data:response.data.data.updateUser
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
        dispatch({
          type: "UPDATE_USER",
          payload: {
            user: {},
          },
        });
      });
    
  };
};

export const deleteUser = (userId) => {
  console.log("delete user id: ", userId);
  return async (dispatch) => {
    ApplicationService.http()
      .post("/graphql", {
        query:`
        mutation {
          deleteUser(id: "`+userId+`")
        }
        `,
      },{
        headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
        
      })
      .then((response) => {
        console.log("DeleteResponse: ", response);
        console.log("userId:",userId);
        dispatch({
          type: "DELETE_USER",
          payload: {
            id: userId,
          },
        });
      })
      .catch((error) => {
        console.log("error -- responsee", error);
      });
  };
};
