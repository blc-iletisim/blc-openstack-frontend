const initialState = {
    categories: [],
    isError: false,
  };
  
  const categoriesReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_CATEGORIES":
        return {
          ...state,
          categories: action.payload.categories,
          isError: action.payload.errorStatus,
        };
  
     
    }
    return state;
  };
  
  export default categoriesReducer;
  