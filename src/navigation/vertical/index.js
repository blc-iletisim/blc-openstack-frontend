import { Map, List, Monitor, Users,UserCheck,Database, Bell, PieChart,CheckCircle } from "react-feather";
import { GrOrganization } from "react-icons/gr";
import { BiDevices } from "react-icons/bi";
import { HiOutlinePhotograph } from "react-icons/hi";
export default [
 
  {
    id: "UserManagement",
    title: "Kullanıcı Yönetimi",
    icon: <Users size={20} />,
    navLink: "/user-management",
  },
  {
    id: "RoleManagement",
    title: "Rol Yönetimi",
    icon: <UserCheck size={20} />,
    navLink: "/role-management",
  },
  {
    id: "DatabaseManagement",
    title: "Databases",
    icon: <Database size={20} />,
    navLink: "/database-management",
  },
  
];
