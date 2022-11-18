const initialState = {
  roles: [],
  isError: false,
};

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ROLES":
      return {
        ...state,
        roles: action.payload.roles,
        isError: action.payload.errorStatus,
      };
      case "ADD_ROLES":
        return {
          ...state,
          roless: [...state.roles, action.payload.roles],
        };
      case "DELETE_ROLES":
    
        return {
          ...state,
          roles: state.roles.filter(
            (roles) => roles.id !== action.payload.id
          ),
        };
  
        case "UPDATE_ROLES":
          console.log("roles update state: ",state)
          console.log("update roles reducer",action.payload)
          return {
            ...state,
            roles: state.roles.map((roles) => {
              if (roles.id === action.payload.roles.id) {
                return action.payload.roles;
              }
              return roles;
            }),
          };
    }
  return state;
};  
export default rolesReducer;