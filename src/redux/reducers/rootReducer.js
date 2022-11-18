import { combineReducers } from "redux";
import auth from "./auth";
import navbar from "./navbar";
import layout from "./layout";

import users from "./users";
import permissionsReducer from "./permissions";
import organisationReducer from "./organisations";

import rolesReducer from "./roles";



const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  permissionsReducer,
  users,
  organisationReducer,
  rolesReducer,

});

export default rootReducer;
