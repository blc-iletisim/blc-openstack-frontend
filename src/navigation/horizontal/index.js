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
  Target,
  Cloud,
  Package,
  Briefcase
} from "react-feather";
//import 'semantic-ui-css/semantic.min.css'
import { GrOrganization } from "react-icons/gr";
import { BiDevices } from "react-icons/bi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { Icon } from '@iconify/react';
export default [
  {
    id: "UserManagement",
    title: "User Management",
    //icon: <Users size={18} />,
    icon:  <Icon icon="carbon:id-management" />,
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
    //icon: <Database size={18} />,
    icon: <Icon icon="material-symbols:database" />,
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
    title: "Hadoop",
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
  {
    id: "OrganizationManagement",
    title: "Organization",
    icon: <Briefcase size={18} />,
    navLink: "/pem-management",
  },
];
