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
    }
    return state;
};  
export default rolesReducer;