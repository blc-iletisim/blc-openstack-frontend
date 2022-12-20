const initialState = {
  data: [],
  total: 0,
};

const userReducer = (state = initialState, action) => {
    console.log("userAction: ",action)
    switch (action.type) {
      case "GET_USER":
        return {
          ...state,
          data: action.payload.user,
          total: action.payload.user.length,
        };
      default:
        return state;
    }
  };
  export default userReducer;