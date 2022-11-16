import { lazy } from "react";

// ** Document title
const TemplateTitle = "%s";

// ** Default Route
const DefaultRoute = "/user-management";

// ** Merge Routes
const Routes = [
 
  {
    path: "/user-management",
    component: lazy(() => import("../../views/UserManagement")),
  },
  
  {
    path: "/login",
    component: lazy(() => import("../../views/Login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/error",
    component: lazy(() => import("../../views/Error")),
    layout: "BlankLayout",
  },
 
];

export { DefaultRoute, TemplateTitle, Routes };