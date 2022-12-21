import ApplicationService from "../../../services/ApplicationService";
import checkPermission from "../../../utils/checkPermission";
import { AUTH_PERMISSIONS } from "../../../configs/auth_permissions.enum";

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
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
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


    //localde tutmak güvenlik açığı yaratabilir v2'de değiştirilmesi gerekebilir bunların: 
    localStorage.setItem("accessToken", data.data?.login?.accessToken);
    localStorage.setItem("refreshToken", res.data?.data?.login?.refreshToken);
    localStorage.setItem("currentUser", data.data?.login?.user?.name);
    localStorage.setItem("currentUserRole", data.data?.login?.role);
    localStorage.setItem("currentUserId", data.data?.login?.user.id);
    localStorage.setItem("currentUserCompanyId", data.data?.login?.user?.company?.id);
    let token2 = localStorage.getItem('currentUserCompanyId');
    console.log("tokent2: ",token2)
    let token = localStorage.getItem('currentUserRole');
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
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem(" currentUserRole");
    localStorage.removeItem("currentUserId");
    //localStorage.clear();
  };
};
