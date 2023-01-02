import ApplicationService from "../../../services/ApplicationService";
import  secureLocalStorage  from  "react-secure-storage";

export const getCategories = () => {
  return async (dispatch) => {
    ApplicationService.http()
      .post(
        "/graphql",{
          query:`
    
            {
              categories {
                id
                name
              
              }
            }

              
              
          `,
        },{
          headers:{Authorization:'Bearer '+ secureLocalStorage.getItem('accessToken')}
          
        }    
      )
      .then((response) => {
        console.log("getCategories response: ",response)
         const categories = response.data.data?.categories;
        dispatch({
          type: "GET_CATEGORIES",
          payload: {
            categories,
          },
        });
      });
  };
};

/* export const addDevice = (device) => {
  console.log("addDevice device: ",device)
  console.log("userId: ",device.user.id)
  
  return async (dispatch) => { 
    console.log("userId: ",device.user.id)
    ApplicationService.http()
      .post(
        "/graphql",
       {
        query:`
        mutation {
          createDevice(
            input: {
              name: "`+device.name+`"
              macAddress: "`+device.macAddress+`"
              model: "`+device.model+`"
              status: true
              deviceType: "`+device.model+`"
              hardware: "string"
              maxMemory: "string"
              networkOperator: "string"
              serialNumber: 1
              ipAddress: "string"
              user: "`+device.user.id+`"
            }
          ) {
            id
            name
            macAddress
            model
            status
            deviceType
            hardware
            maxMemory
            networkOperator
            serialNumber
            ipAddress
            user {
              id
              name
              email
              oneSignalId
             
              
            
            }
         
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
          type: "ADD_DEVİCE",
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

export const updateDevice = (device) => {
  console.log("updateDevice: ",device);
  console.log("device personel: ",device.personel);
  if (device.personel === undefined) {
    device.personel = { id: device?.user?.id, name: "" };
  }
  return async (dispatch) => {
    console.log(device);
    ApplicationService.http()
      .post(
        "/graphql",
       {
        query:`
        mutation {
          updateDevice(
            id: "`+device.id+`"
            input: {
              name: "`+device.name+`"
              macAddress: "`+device.macAddress+`"
              model: "`+device.model+`"
              status: true
              deviceType: "`+device.model+`"
              hardware: "string"
              maxMemory: "string"
              networkOperator: "string"
              serialNumber: 1
              ipAddress: "string"
              user:"`+device.user.id+`"
            }
          ) {
            id
            name
            macAddress
            model
            status
            deviceType
            hardware
            maxMemory
            networkOperator
            serialNumber
        
            user {
              id
              name
              email
        
              workerNumber
            
             
            }
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
          type: "UPDATE_DEVICE",
          payload: {
            device: response.data.data.updateDevice,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
};

export const deleteDevice = (id) => {
  console.log("DeleteId: ",id);
  return async (dispatch) => {
    ApplicationService.http()
      .post("/graphql", {
        query:`mutation {
          deleteDevice(id: "`+id+`")
        }
        `,
      },{
        headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
        
      })
      .then((response) => {
        console.log("response: ", response);
        dispatch({
          type: "DELETE_DEVICE",
          payload: {
            id:id,
          },
        });
      })
      .catch((error) => {
        console.log("error ********s", error);
      });
  };
};
 */