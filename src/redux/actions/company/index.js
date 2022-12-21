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
                    company{name}
                    name
                    email
                role{
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
