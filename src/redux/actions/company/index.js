import ApplicationService from "../../../services/ApplicationService";

export const getCompany = (companyId) => {
    console.log("companyId: ",companyId)
  return async (dispatch) => {
    ApplicationService.http()
      .post(
        "/graphql",{
          query:`
    
            {
                company(id: "`+companyId+`") {
                  id
                  name
                  users {
                    id
                    name
                    email
                    company{name}
                    role{
                    name
                    }
              
                    instances{
                      id
                      name
                      pemName
                      flavor{
                        id
                        name
                        cpu_size
                        ram_size
                        root_disk
                      }
                      image{
                        id
                        name
                      }
                      user{
                       id
                       company{name}
                       name
                              
                      }
                      categories{
                        id
                        name
                      }
                    }
                  }
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
        console.log("getCompany response: ",response)
         const company = response.data.data?.company.users;
        dispatch({
          type: "GET_COMPANY",
          payload: {
            company,
          },
        });
      });
  };
};
