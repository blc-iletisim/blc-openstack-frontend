import ApplicationService from "../../../services/ApplicationService";
import checkPermission from "../../../utils/checkPermission";
import { AUTH_PERMISSIONS } from "../../../configs/auth_permissions.enum";
import  secureLocalStorage  from  "react-secure-storage";

export const handleLogin = (email, password) => async (dispatch) => {
  try {
    const res = await ApplicationService.httpWithoutAuthorization().post(
      "/graphql",
      {
        query:
          `
     
        
        mutation {
          login(input: { email: "` +
          email +
          `", password: "` +
          password +
          `" }) {
          
            accessToken
            refreshToken
            role
              user{
                id
                name
              }
              user{company{name,id}}

            deletedDateTime
          }
        }


      
      
      
      `,
      },
      {
        headers: {
          Authorization: "Bearer " + secureLocalStorage.getItem("accessToken"),
        },
      }
    );
    const data = res.data;
console.log("Login Data: ",res.data.data)
    dispatch({
      type: "LOGIN",
      payload: res.data.data.login,
      

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


    //localde tutulan role gibi değişkenleri kıyaslarken haskleyip vermen lazım admin vs yazmak yerine v2 de düzeltilecek!!!
    secureLocalStorage.setItem("accessToken", data.data?.login?.accessToken);
    secureLocalStorage.setItem("refreshToken", res.data?.data?.login?.refreshToken);
    secureLocalStorage.setItem("currentUser", data.data?.login?.user?.name);
    secureLocalStorage.setItem("currentUserRole", data.data?.login?.role);
    secureLocalStorage.setItem("currentUserId", data.data?.login?.user.id);
    secureLocalStorage.setItem("currentUserCompanyId", data.data?.login?.user?.company?.id);
    let token2 = localStorage.getItem('currentUserCompanyId');
    //console.log("tokent2: ",token2)
   // let token = localStorage.getItem('currentUserRole');
    return data.data.login;
  } catch (error) {
    console.log("error: ", error);
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
    secureLocalStorage.removeItem("currentUser");
    secureLocalStorage.removeItem("accessToken");
    secureLocalStorage.removeItem("refreshToken");
    secureLocalStorage.removeItem(" currentUserRole");
    secureLocalStorage.removeItem("currentUserId");
    secureLocalStorage.removeItem("currentCompanyId");
    //localStorage.clear();
  };
};
