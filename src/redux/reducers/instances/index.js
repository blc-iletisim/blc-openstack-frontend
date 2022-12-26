const initialState = {
  instances: [],
  isError: false,
};

const instancesReducer = (state = initialState, action) => {
  console.log("instanceAction: ", action);
  console.log("instanceState: ", state);
  switch (action.type) {
    case "GET_INSTANCES":
      return {
        ...state,
        total: action.payload.instances?.length,
        instances: action.payload.instances,
        isError: action.payload.errorStatus,
      };

    case "ADD_INSTANCE":
      return {
        ...state,
        total: action.payload.instances?.length,
        instances: [...state.instances, action.payload.instances],
      };
    case "DELETE_INSTANCE":
      return {
        ...state,
        //total: action.payload.instances?.length,
        //instances: [...state.instances, action.payload.instances],
        instances: state.instances.filter((ins) => ins.id != action.payload.id),
      };
    case "UPDATE_INSTANCE":
      return {
        ...state,
        total: action.payload.instances?.length,
        instances: [...state.instances, action.payload.instances],
      };
  }
  return state;
};

export default instancesReducer;
