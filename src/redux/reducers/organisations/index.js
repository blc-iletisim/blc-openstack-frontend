const initialState = {
  dataOrganization: [],
  total:0,
};

const organisationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ORGANISATIONS":
      //console.log("action.payload",action.payload)
      return {
        ...state,
        dataOrganization: action.payload.organisations,
        total: action.payload.organisations.length,
        //dataOrganization: [...action.payload.organisations],
      };
    case "ADD_ORGANIZATION":
      return {
        ...state,
        dataOrganization: [
          ...state.dataOrganization,
          action.payload.organisation,
        ],
      };
    case "UPDATE_ORGANIZATION":
      return {
        ...state,
        dataOrganization: [
          ...state.dataOrganization.map((organisation) => {
            if (organisation.id === action.payload.organisation.id) {
              return action.payload.organisation;
            }
            return organisation;
          }),
        ],
      };

    case "DELETE_ORGANIZATION":
      
      return{
       ...state,
        dataOrganization:[
          ...state.dataOrganization.filter(organisation => organisation.id != action.payload.id)

        ]
        /* ...state,
        organisation: state.organiation.filter(
          (org) => org.id !== action.payload.id
        ), */
      };

    default:
      return state;
  }
};

export default organisationReducer;
