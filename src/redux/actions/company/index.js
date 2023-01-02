import ApplicationService from "../../../services/ApplicationService";
import  secureLocalStorage  from  "react-secure-storage";

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
                      createdDateTime
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
                
                }
            }
                        
              
          `,
        },{
          headers:{Authorization:'Bearer '+ secureLocalStorage.getItem('accessToken')}
          
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
