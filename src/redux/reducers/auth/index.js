const initialState = {
  uid: null,
  user: null,
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  role:null,
}

const authReducer = (state = initialState, action) => {
   console.log("authAction: ",action)
  switch (action.type) {
    case 'LOGIN':
      return {
        uid: action.payload.user.id,
        user: action.payload.user,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        role:action.payload.role,
      }
    case 'LOGOUT':
      return {
        uid: null,
        user: null,
        isLoggedIn: false,
        accessToken: null,
        refreshToken: null,
      }
    default:
      return state
  }
}

export default authReducer
