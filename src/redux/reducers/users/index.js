const initialState = {
  data: [],
  total: 0,
};

const DataTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USERS":
      return {
        ...state,
        data: action.payload.users,
        total: action.payload.users.length,
      };
    case "ADD_USER":
      //console.log("reducer ",action.payload.data)
      return {
        ...state,
        data: [...state.data, action.payload.data],
        total: state.total + 1,
      };
      case "DELETE_USER":
        return{
          ...state,
          data:state.data.filter(user=>user.id!=action.payload.id)
        }

    case "UPDATE_USER":
      console.log("update user state: ",state)
      console.log("action: ", action);
      /*return {
        ...state,
        data: state.data.map((user) => {

          if (user.uid == action.payload.user.uid) {
            console.log(action.payload.user)
            return {...action.payload.user}
          }
          return {...user};
        })
      };*/
      return {
        ...state,
        data: state.data.map((user) => {
          if (user.id === action.payload.data?.updateUser.id) {
            return action.payload.data.updateUser;
          }
          return user;
        }),
      };
    default:
      return state;
  }
};

export default DataTablesReducer;