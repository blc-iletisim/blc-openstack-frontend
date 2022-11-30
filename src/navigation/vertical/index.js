import {
  Map,
  List,
  Monitor,
  Users,
  UserCheck,
  Database,
  Bell,
  PieChart,
  CheckCircle,
  Archive,
  Target,
  Cloud,
  Package
} from "react-feather";
import { GrOrganization } from "react-icons/gr";
import { BiDevices } from "react-icons/bi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { Icon } from '@iconify/react';
export default [
  {
    id: "UserManagement",
    title: "User Management",
    icon: <Users size={18} />,
    navLink: "/user-management",
  },
  {
    id: "RoleManagement",
    title: "Role Management",
    icon: <UserCheck size={18} />,
    navLink: "/role-management",
  },
  {
    id: "DatabaseManagement",
    title: "Databases",
    icon: <Database size={18} />,
    navLink: "/database-management",
  },
  {
    id: "DockerManagement",
    title: "Docker",
    icon: <Icon icon="mdi:docker" width="30" height="30" />,
    navLink: "/docker-management",
  },
  {
    id: "HadoopManagement",
    title: "Docker",
    icon: <Icon icon="grommet-icons:hadoop" width="28" height="28" />,
    navLink: "/hadoop-management",
  },
  {
    id: "KubernetesManagement",
    title: "Kubernetes",
    icon: <Icon icon="mdi:kubernetes" width="28" height="28" />,
    navLink: "/kubernetes-management",
  },
  {
    id: "InstanceManagement",
    title: "Instances",
    icon: <Archive size={18} />,
    navLink: "/instance-management",
  },
];
