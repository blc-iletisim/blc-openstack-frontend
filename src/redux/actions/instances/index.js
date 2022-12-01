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
               
                flavor {
                    id
                    name
                    cpu_size
                    ram_size
                    root_disk
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

  //Multi selection olması gerekiyorsa aşağıdaki kısımın yorumunu açıp flavors ve categories kısımlarında bu arrayleri gönder (ek olarak [${role.roles}] bu formatta yazmayı unutma)

/*   const arrFlavors=[];
  const r=instance?.flavors.forEach((s) => {
    arrFlavors.push('"'+s+'"'); });
    const arrCategories=[];
    const r2=instance?.categories.forEach((s) => {
      arrCategories.push('"'+s+'"'); });
   */
  
  return async (dispatch) => { 
    
    ApplicationService.http()
      .post(
        "/graphql",
       {
        query:`
        
            mutation {
                createInstance(input: {name:"`+instance?.name+`",flavor:"`+instance?.flavors+`",categories:"`+instance?.categories+`",image:"c83a84bd-f521-46ea-8830-4e93975ce101",pem:"c83a84bd-f521-46ea-8830-4e93975ce101"}){
                id
                name
               
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
            instances: response.data.data.createInstance,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};


export const updateInstance = (instance) => {
  console.log("updateInstance: ",instance);
  
  if (instance.personel === undefined) {
    instance.personel = { id: instance?.user?.id, name: "" };
  }
  return async (dispatch) => {
    
    ApplicationService.http()
      .post(
        "/graphql",
       {
        query:`
       
mutation {
  updateInstance(id: "`+instance.id+`", input: {categories:"`+instance.categories+`",flavor:"`+instance.flavors+`",name:"`+instance.name+`"}) {
    id
    name
    flavor {
      id
      name
      cpu_size
      ram_size
      root_disk
 
    }
    image {
      id
      name

    }
    user {
      id
      name
      email

      company
  
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
        console.log("update response", response);
        dispatch({
          type: "UPDATE_INSTANCE",
          payload: {
            instances: response.data.data.updateInstance,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};

export const deleteInstance = (instanceId) => {
  console.log("delete instance id: ", instanceId);
  return async (dispatch) => {
    ApplicationService.http()
      .post("/graphql", {
        query:`
              mutation {
          deleteInstance(id: "`+instanceId+`")
        }

        `,
      },{
        headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
        
      })
      .then((response) => {
        console.log("DeleteResponse: ", response);
        console.log("instanceId:",instanceId);
        dispatch({
          type: "DELETE_INSTANCE",
          payload: {
            id: instanceId,
          },
        });
      })
      .catch((error) => {
        console.log("error -- responsee", error);
      });
  };


  
};

