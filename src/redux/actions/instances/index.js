import ApplicationService from "../../../services/ApplicationService";

export const getInstances = () => {
  return async (dispatch) => {
    ApplicationService.http()
      .post(
        "/graphql",{
          query:`
    
            {
                instances {
                id
                name
                pem {
                    id
                    name
                    pem_url
            
                }
                flavor {
                    id
                    name
                
                }
            
            
                categories {
                    id
                    name
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
        console.log("getInstances response: ",response)
        const instances = response.data.data?.instances;
        dispatch({
          type: "GET_INSTANCES",
          payload: {
            instances,
          },
        });
      });
  };
};

export const addInstances = (instance) => {
  console.log("addInstances instance: ",instance)
 
  
  return async (dispatch) => { 
    
    ApplicationService.http()
      .post(
        "/graphql",
       {
        query:`
        
            mutation {
                createInstance(input: {name:"`+instance?.name+`",flavor:"`+instance?.flavors?.id+`",categories:"`+instance?.categories?.id+`",image:"c83a84bd-f521-46ea-8830-4e93975ce101"}){
                id
                name
                pem {
                    id
                    name
                    pem_url
                
                }
                flavor {
                    id
                    name
                    
                }
                image {
                    id
                    name
                
                }
            
                categories {
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
        console.log("addDevice response: ", response);
       
        dispatch({
          type: "ADD_INSTANCE",
          payload: {
            devices: response.data.data.createDevice,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};

