const initialState = {
  roles: [],
  isError: false,
};

const rolesReducer = (state = initialState, action) => {
  console.log("state:", state);
  switch (action.type) {
    case "GET_ROLES":
      return {
        ...state,
        roles: action.payload.roles,
        total: action.payload.roles.length,
        isError: action.payload.errorStatus,
      };
    case "ADD_ROLES":
      return {
        ...state,
        roles: [...state.roles, action.payload.roles],
        total: state.total + 1,
      };
    case "DELETE_ROLES":
      console.log("roles delete state: ", state);
      return {
        ...state,
        roles: state.roles.filter((roles) => roles.id != action.payload.id),
        /*    (roles) => roles.id !== action.payload.id
          ), */
      };

    case "UPDATE_ROLES":
      return {
        ...state,
        roles: state.roles.map((role) => {
          if (role.id === action.payload.roles.id) {
            return action.payload.roles;
          }
          return role;
        }),
      };
  }

  return state;
};
export default rolesReducer;
