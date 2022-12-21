const initialState = {
    company: [],
    isError: false,
  };
  
  const companyReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_COMPANY":
        return {
          ...state,
          company: action.payload.company,
          isError: action.payload.errorStatus,
        };
  
     
    }
    return state;
  };
  
  export default companyReducer;
  