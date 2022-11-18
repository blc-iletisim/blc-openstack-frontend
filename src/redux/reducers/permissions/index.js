const initialState = {
    roles: [],
    isError: false,
  };
  
  const permissionsReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_PERMISSIONS":
        return {
          ...state,
          permissions: action.payload.permissions,
          isError: action.payload.errorStatus,
        };
    }
    return state;
  };  
  export default permissionsReducer;