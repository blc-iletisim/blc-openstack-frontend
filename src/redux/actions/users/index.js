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
              password
              company
              role {
                id
                name
              
                createdDateTime
                updatedDateTime
                deletedDateTime
              }
              instances {
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
    let arr = []
    let arr2 = []
    let arr3 = []
    const d = new Date()
    let text = d.toString()
    let year = d.getFullYear() + "-"
    let month = d.getMonth()
    let day = d.getDay()
    let timezone = d.getTimezoneOffset() / 60
    timezone = Math.abs(timezone)
    if (month.toString().length === 1)
      month = "0" + month
    if (timezone.toString().length === 1)
      timezone = "0" + timezone
    if (day.toString().length === 1)
      day = "0" + day

  /*Object.entries(data.workingHours).forEach(
    ([key, value]) => {
        key = key.toString()
        arr3 = value.split(",")
        for( let i = 0; i < arr3.length; i++)
        {
          arr2 = arr3[i].split("-")
          let res = year + month + "-"+ day + "T" + timezone + ":" + arr2[0]
          let res1 = year + month + "-"+ day + "T" + timezone + ":" + arr2[1]
          arr.push({"day":key,"startTime":res.toString(),"finishTime":res1.toString()})
        }
        
    }
  ) */
  //data.workingHours = arr
  //console.log(data)

/*   for (let i = 0; i < data.permissions.length; i++) {
    data.permissions[i] = data.permissions[i].uid
  } */

  
  return async (dispatch) => {
    console.log("dispatch: ",dispatch);
    ApplicationService.http()
      .post(
        "/graphql",{
          query:`
          mutation {
            createUser(
              input: {
                name: "`+data.name+`"
                email: "`+data.email+`"
                password: "`+data.password+`"
                company: "`+data.organization+`"
                role:"`+data.roles+`"
              }
            ) {
              id
              name
              email
              password
              company
              role {
                id
                name
             
              }
              instances {
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

  let arr = []
    let arr2 = []
    const d = new Date()
    let text = d.toString()
    let year = d.getFullYear() + "-"
    let month = d.getMonth()
    let day = d.getDay()
    let timezone = d.getTimezoneOffset() / 60
    timezone = Math.abs(timezone)
    if (month.toString().length === 1)
      month = "0" + month
    if (timezone.toString().length === 1)
      timezone = "0" + timezone
    if (day.toString().length === 1)
      day = "0" + day
   /*  console.log(data.workingHours)
  console.log(data)
  Object.entries(data.workingHours).forEach(
    ([key, value]) => {
        if(isNaN(key) && value !== null)
        {
          arr2 = value.split("-")
          let res = year + month + "-"+ day + "T" + timezone + ":" + arr2[0]
          let res1 = year + month + "-"+ day + "T" + timezone + ":" + arr2[1]
          if(arr2[0] !== undefined && arr2[1] !== undefined)
          {
            arr.push({"day":key,"startTime":res.toString(),"finishTime":res1.toString()})
          }
          
        }
          console.log(arr)
    }
  ) */
  //data.workingHours = arr
  //console.log("Before Post: ", data)
  //console.log( "UUID of user: ",data.uid)

  /* for (let i = 0; i < data.permissions.length; i++) {
    data.permissions[i] = data.permissions[i].uid
  } */
  return async (dispatch) => {
    console.log("updateUser data: ",data);
    ApplicationService.http()
      .post("/graphql",
      {
        query:`
       
          mutation {
            updateUser(id: "`+data.id+`", input: {company:"`+data.organization+`",email:"`+data.email+`",name:"`+data.name+`",password:"`+data.password+`",role:"af321f59-2164-4a9a-944a-c5760228e8b8"}) {
              id
              name
              email
              password
              company
              role {
                id
                name

              }
              instances {
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
        console.log("updateUser response: ",response)
    
        let obj = {}
        /* Object.entries(user?.workingHours).forEach(
          ([key, value]) => {
            if(!isNaN(key))
            {
              let str = value.startTime.split(":")
              let str2 = value.finishTime.split(":")
              let str3 = str[1] + ":" + str[2] + "-" + str2[1] + ":" + str2[2]
              let keyDay = value.day.toString()
              let pair = {[keyDay]: str3}
              obj = {...obj, ...pair};
            }
            else
            {
              let pair = {[key]: value}
              obj = {...obj, ...pair};
            }
          }
        ) */
        //user.workingHours = obj 
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
    /*return WSUsersService.send(
      "/users.update",
      sender,
      data,
      /*(snapshot) => {
        const user = JSON.parse(snapshot.body);
        dispatch({
          type: "UPDATE_USER",
          payload: {
            user,
          },
        });
      },
      (error) => {
        console.log("error", error);
        dispatch({
          type: "UPDATE_USER",
          payload: {
            user: {},
          },
        });
      }*/
    /*);*/
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

/*export const getPermissions = () => {
    ApplicationService.http()
      .get("/permission/getAllPermissions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response)
        console.log(response.data)
      })
      .catch((error) => {
        console.log("error -- responsee", error);
      });

};*/