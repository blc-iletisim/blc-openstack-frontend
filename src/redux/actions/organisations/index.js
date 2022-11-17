import ApplicationService from "../../../services/ApplicationService";
import { DateRange } from "@mui/icons-material";

export const getOrganisations = () => {
  return async (dispatch) => {
    ApplicationService.http()
      .post("/graphql", {
        query:`
        {
          organizations {
            id
            name
            users {
              id
              name
              email
           
             
              createdDateTime
              updatedDateTime
              deletedDateTime
            }
            createdDateTime
            updatedDateTime
            deletedDateTime
          }
        }
        
       
        
        
        `,
      },{
        headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
        
      }   )
      .then((response) => {
        console.log("Organisation get response: ",response)
        const organisations = response.data.data.organizations;
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
//get hariç yeni sorguların eklenmesi lazım!!!
export const addOrganization = (data) => {
  console.log("data: ", data);
  console.log("dataId: ",data.responsibleUser);
  return async (dispatch) => {
    ApplicationService.http().post(
      "/graphql",
     {
      query:`
      mutation {
        createOrganization(input: { name: "`+data.name+`" }) {
          id
          name
          users {
            id
            name
         
        
           
            createdDateTime
            updatedDateTime
            deletedDateTime
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
        //const organisation = response.data;
        dispatch({
          type: "ADD_ORGANIZATION",
          payload: {
            organisation: response.data.data.createOrganization,
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
              updateOrganization(id: "`+data.id+`", input: { name: "`+data.name+`" }) {
                id
                name
                users {
                  id
                  name
                  email
                  

                  createdDateTime
                  updatedDateTime
              
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
        console.log("update organisation response: ", response);
        const organisation = response.data.data.updateOrganization;
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
          deleteOrganization(id: "`+id+`")
        }
        
        `,
      },{
        headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
        
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
