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
    path: "/instance-management",
    component: lazy(() => import("../../views/InstanceManagement")),
  },
  {
    path: "/role-management",
    component: lazy(() => import("../../views/RoleManagement")),
  },
  {
    path: "/database-management",
    component: lazy(() => import("../../views/DatabaseManagement")),
  },
  {
    path: "/docker-management",
    component: lazy(() => import("../../views/DockerManagement")),
  },
  {
    path: "/hadoop-management",
    component: lazy(() => import("../../views/HadoopManagement")),
  },
  {
    path: "/kubernetes-management",
    component: lazy(() => import("../../views/KubernetesManagement")),
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