import ApplicationService from "../../../services/ApplicationService";
import  secureLocalStorage  from  "react-secure-storage";

export const getUser = (userId) => {
    console.log("getUserId", userId);
    return async (dispatch) => {
      ApplicationService.http()
        .post("/graphql", {
          query:`
  
          {
            user(id: "`+userId+`") {
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
                createdDateTime
                id
                name
                pemName
                flavor{
                  ram_size
                  root_disk
                  name
                  __typename
                  cpu_size
                  id
                }
                image{
                  __typename
                  name
                  id
                }
                user{
                  __typename
                  company{
                    __typename
                    id
                    name
                   
                  }
                  email
                  id
                }
                categories{
                  __typename
                  id
                  name
                  
                }
            
              }
              createdDateTime
              updatedDateTime
              deletedDateTime
            }
          }
          
            
          `,
        },{
          headers:{Authorization:'Bearer '+ secureLocalStorage.getItem('accessToken')}
          
        })
        .then((response) => {
          console.log("getUser response: ",response);
          const user = response.data.data.user;
          dispatch({
            type: "GET_USER",
            payload: {
              user,
            },
          });
        })
        .catch((error) => {
          console.log("error -- responsee", error);
        });
    };
  };