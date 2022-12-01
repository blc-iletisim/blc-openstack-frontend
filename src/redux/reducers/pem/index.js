const initialState = {
    pems: [],
    isError: false,
  };
  
  const pemReducer = (state = initialState, action) => {
    console.log("state:", state);
    switch (action.type) {
     
      case "ADD_PEM":
        return {
          ...state,
          pems: [...state.pems, action.payload.pems],
          total: state.total + 1,
        };
     
  
      
    }
  
    return state;
  };
  export default pemReducer;
  