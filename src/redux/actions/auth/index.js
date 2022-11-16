import ApplicationService from "../../../services/ApplicationService";
import checkPermission from "../../../utils/checkPermission";
import {AUTH_PERMISSIONS} from "../../../configs/auth_permissions.enum";

export const handleLogin = (email, password) => async (dispatch) => {
  try {
    const res = await ApplicationService.httpWithoutAuthorization().post("/graphql", {
      query: `
     
        mutation {
          login(input: { email: "`+email+`", password: "`+password+`" }) {
            
            accessToken
            refreshToken
            type
            role
            email
            user {
              id
              name
              email
              password
              company
          
              createdDateTime
              updatedDateTime
              deletedDateTime
            }
            
            deletedDateTime
          }
        }

      
      
      
      `,
    },{
      headers:{Authorization:'Bearer '+ localStorage.getItem('accessToken')}
      
    });
    const data = res.data;
  
    //console.log("email: ",data.data.login.email);
    console.log("email: ",email);
    console.log("password: ",password);
    //console.log("login:",data.data.login)
   // localStorage.setItem("permissionTag", JSON.stringify(res.data.data.login.user.roles.map(rol=>rol?.permissions.map(perm => perm?.tag))));
    //console.log("PermissionTag:",localStorage.getItem("permissionTag"))
    //localStorage.setItem("permissionId", JSON.stringify(res.data.data.login.user.roles.permissions.map(perm => perm?.id)));
    //console.log("PermissionId:",localStorage.getItem("permissionId"))
   // const tag= localStorage.getItem("permissionTag")
    //console.log("tag: ", tag)
    //const id =localStorage.getItem("permissionId")
    //console.log("id: ",id)
    
    //console.log("AUTH_PERMISSIONS.WEB_AUTH_LOGIN: ",AUTH_PERMISSIONS.WEB_AUTH_LOGIN)
  
   // console.log("data.data.login.user.role.permissions: ",data.data.login.user.role.permissions)
    //const perms=data.data.login.user.roles.map(rol=>rol?.permissions.map(perm => perm?.tag))
    //const perms=data.data.login.user.role.permissions.map(perm => perm?.tag)
    //console.log("perms: ",perms)
   
    
    // if (checkPermission(res.data.data.login.role, AUTH_PERMISSIONS.WEB_AUTH_LOGIN) !== true) {
    // if (checkPermission(tag[4], AUTH_PERMISSIONS.WEB_AUTH_LOGIN) !== true) {
    // if (checkPermission(data.data.login.user.role.permissions, AUTH_PERMISSIONS.WEB_AUTH_LOGIN) !== true) {
    // if (checkPermission(id[4], AUTH_PERMISSIONS.WEB_AUTH_LOGIN) !== true) {
   
   //!!!!!!!bu kısımı düzelt yorumu aç alttakini sil (geçici giriş için yapıldı)!!!!!!!!
    //if (checkPermission(perms, AUTH_PERMISSIONS.WEB_AUTH_LOGIN) !== true) {
  /*   if (checkPermission(perms, AUTH_PERMISSIONS.WEB_AUTH_LOGIN) == true) {
      throw new Error("Bu hesap için yetkiniz yok.");
    } */
    dispatch({
      type: "LOGIN",
      payload: res.data.data,
    });
    /*if (res.status === 401) {
      try {
        const responseRefresh = await ApplicationService.http().get("/auth/refresh");
        localStorage.setItem(
          "refreshToken",
          responseRefresh.data.refreshToken
        );
        localStorage.setItem("accessToken", responseRefresh.data.accessToken);
      } catch (error) {
        console.log("error", error);
      }
    }*/
    
    localStorage.setItem("accessToken", data.data.login.accessToken);
    localStorage.setItem("refreshToken", res.data.data.login.refreshToken);
    localStorage.setItem("currentUser", data.data.login.user.name);
    return data.data.login;
  } catch (error) {
    console.log("error: ",error)
    if (error.message !== "Bu hesap için yetkiniz yok.") {
      error.message = "Kullanıcı bilgileri hatalıdır. Lütfen tekrar deneyiniz.";
    }
    throw error;
  }
};

export const handleLogout = () => {
  return (dispatch) => {
    dispatch({
      type: "LOGOUT",
    });
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };
};