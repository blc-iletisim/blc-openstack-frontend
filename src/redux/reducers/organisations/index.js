const initialState = {
    data: [],
    total: 0,
  };
  
  const DataTablesReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ANNOUNCEMENTS":
        return {
          ...state,
          data: action.payload.announcements,
          total: action.payload.announcements.length,
        };
      case "UPDATE_ANNOUNCEMENT":
        console.log("reducer update data: ",state)
        return {
          ...state,
          data: state.data.map((announcement) => {
            if (announcement.id === action.payload.id) {
              return action.payload;
            }
            return announcement;
          }),
        };
      case "ADD_ANNOUNCEMENT":
        return {
          ...state,
          data: [...state.data, action.payload],
          total: state.total + 1,
        };
      case "DELETE_ANNOUNCEMENT":
        return {
          ...state,
          data: state.data.filter((announcement) => {
            return announcement.id !== action.payload.id;
          }),
          total: state.total - 1,
        };
  
      default:
        return state;
    }
  };
  
  export default DataTablesReducer;
  