const initialState = {
    pems: [],
    isError: false,
  };
  
  const pemReducer = (state = initialState, action) => {
    console.log("state:", state);
    console.log("action: ",action)
    switch (action.type) {
     
      case "ADD_PEM":
        return {
          ...state,
          pems: [...state.pems, action.payload.pem],
          total: state.total + 1,
        };
        case "UPLOAD_PEM":
          return {
            ...state,
            pems: [...state.pems, action.payload.pem],
            total: state.total + 1,
          };
          case "GET_PEM":
          return {
            ...state,
            pems: [...state.pems, action.payload.pem],
            total: state.total + 1,
          };
     
  
      
    }
  
    return state;
  };
  export default pemReducer;
  