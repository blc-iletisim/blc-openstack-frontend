import { combineReducers } from "redux";
import auth from "./auth";
import navbar from "./navbar";
import layout from "./layout";

import users from "./users";
import permissionsReducer from "./permissions";
import organisationReducer from "./organisations";
import categoriesReducer from "./categories";
import rolesReducer from "./roles";
import flavorsReducer from "./flavors"



const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  permissionsReducer,
  users,
  organisationReducer,
  rolesReducer,
  categoriesReducer,
  flavorsReducer,

});

export default rootReducer;
