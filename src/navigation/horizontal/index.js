import {
  Map,
  List,
  Users,
  UserCheck,
  Database,
  Monitor,
  Bell,
  PieChart,
  CheckCircle,
  Archive,
} from "react-feather";
import { GrOrganization } from "react-icons/gr";
import { BiDevices } from "react-icons/bi";
import { HiOutlinePhotograph } from "react-icons/hi";
export default [
  {
    id: "UserManagement",
    title: "User Management",
    icon: <Users size={20} />,
    navLink: "/user-management",
  },
  {
    id: "RoleManagement",
    title: "Role Management",
    icon: <UserCheck size={20} />,
    navLink: "/role-management",
  },
  {
    id: "DatabaseManagement",
    title: "Databases",
    icon: <Database size={20} />,
    navLink: "/database-management",
  },
  {
    id: "InstanceManagement",
    title: "Instances",
    icon: <Archive size={20} />,
    navLink: "/instance-management",
  },
];
