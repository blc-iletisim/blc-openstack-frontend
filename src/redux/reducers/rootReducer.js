import { combineReducers } from "redux";
import auth from "./auth";
import navbar from "./navbar";
import layout from "./layout";

import users from "./users";

import organisationReducer from "./organisations";

import rolesReducer from "./roles";



const rootReducer = combineReducers({
  auth,
  navbar,
  layout,

  users,
  organisationReducer,
  rolesReducer,

});

export default rootReducer;
