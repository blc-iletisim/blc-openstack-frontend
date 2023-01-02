import ApplicationService from "../../../services/ApplicationService";
import { DateRange } from "@mui/icons-material";
import  secureLocalStorage  from  "react-secure-storage";

export const getOrganisations = () => {
  return async (dispatch) => {
    ApplicationService.http()
      .post("/graphql", {
        query:`
        
          {
            companies{
              id
              name
              users {
                id
                name
                email
              }
              createdDateTime
              updatedDateTime
              deletedDateTime
            }
          }
        
        `,
      },{
        headers:{Authorization:'Bearer '+ secureLocalStorage.getItem('accessToken')}
        
      }   )
      .then((response) => {
        console.log("Organisation get response: ",response)
        const organisations = response.data.data.companies;
        dispatch({
          type: "GET_ORGANISATIONS",
          payload: {
            organisations,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};

export const addOrganization = (data) => {
  console.log("data: ", data);
  return async (dispatch) => {
    ApplicationService.http().post(
      "/graphql",
     {
      query:`
     
        mutation {
          createCompany(input: { name: "`+data.name+`" }) {
            id
            name
            users {
              id
              name
              email
            
            }
            createdDateTime
            updatedDateTime
            deletedDateTime
          }
        }

              
      
      `

     },{
      headers:{Authorization:'Bearer '+ secureLocalStorage.getItem('accessToken')}
      
    }  
    )
     
      .then((response) => {
        //const organisation = response.data;
        dispatch({
          type: "ADD_ORGANIZATION",
          payload: {
            organisation: response.data.data.createCompany,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};

export const updateOrganization = (data) => {
  console.log("updateOrganization data: ", data);
  return async (dispatch) => {
    ApplicationService.http()
      .post(
        "/graphql",
        {
          query:`
      
              mutation {
                updateCompany(id: "`+data.id+`", input: { name: "`+data.name+`" }) {
                  id
                  name
                  users {
                    id
                    name
                    email
                  }
                  createdDateTime
                  updatedDateTime
                  deletedDateTime
                }
              }

          `
  
         },{
          headers:{Authorization:'Bearer '+ secureLocalStorage.getItem('accessToken')}
          
        }
      )
      .then((response) => {
        console.log("update organisation response: ", response);
        const organisation = response.data.data.updateCompany;
        dispatch({
          type: "UPDATE_ORGANIZATION",
          payload: {
            organisation:organisation,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};

export const deleteOrganization = (id) => {
  console.log("Organization delete id: ", id)
  return async (dispatch) => {
    ApplicationService.http()
      .post("/graphql", {
        query:`
       
            mutation {
              deleteCompany(id: "`+id+`")
            }

        `,
      },{
        headers:{Authorization:'Bearer '+ secureLocalStorage.getItem('accessToken')}
        
      }  )
      .then((response) => {
        //const organisation = response.data.data.organisation;
        dispatch({
          type: "DELETE_ORGANIZATION",
          payload: {
            id:id,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};
