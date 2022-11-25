const initialState = {
    flavors: [],
    isError: false,
  };
  
  const flavorsReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_FLAVORS":
        return {
          ...state,
          flavors: action.payload.flavors,
          isError: action.payload.errorStatus,
        };
  
     
    }
    return state;
  };
  
  export default flavorsReducer;
  