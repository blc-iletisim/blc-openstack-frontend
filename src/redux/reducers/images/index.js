const initialState = {
    images: [],
    isError: false,
  };
  
  const imagesReducer = (state = initialState, action) => {
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
  