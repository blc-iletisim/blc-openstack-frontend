const initialState = {
    company: [],
    isError: false,
  };
  
  const companyReducer = (state = initialState, action) => {
    console.log("companyAction: ",action)
    console.log("companyState",state)
    switch (action.type) {
      case "GET_COMPANY":
        return {
          ...state,
          total: action.payload.company?.length,
          company: action.payload.company,
          isError: action.payload.errorStatus,
        };
  
     
    }
    return state;
  };
  
  export default companyReducer;
  