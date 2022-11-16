const initialState = {
  uid: null,
  user: null,
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        uid: action.payload.uid,
        user: action.payload.user,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
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
