const initialState = {
    images: [],
    isError: false,
  };
  
  const imagesReducer = (state = initialState, action) => {
    console.log("action: ",action)
    console.log("state: ",state)
    switch (action.type) {
      case "GET_IMAGES":
        return {
          ...state,
          images: action.payload.images,
          isError: action.payload.errorStatus,
        };
  
     
    }
    return state;
  };
  
  export default imagesReducer;
  