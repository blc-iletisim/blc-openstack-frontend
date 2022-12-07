import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));
const UserManagement = Loadable(lazy(() => import('pages/management/userManagement')));
const RoleManagement = Loadable(lazy(() => import('pages/management/roleManagement')));

const Databases = Loadable(lazy(() => import('pages/services/databases')));
const Docker = Loadable(lazy(() => import('pages/services/docker')));
const Kubernetes = Loadable(lazy(() => import('pages/services/kubernetes')));
const Hadoop = Loadable(lazy(() => import('pages/services/hadoop')));
const Instances = Loadable(lazy(() => import('pages/services/instances')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '',
            element: <Dashboard />
        },
        {
            path: 'management',
            children: [
                {
                    path: 'users',
                    element: <UserManagement />
                },
                {
                    path: 'roles',
                    element: <RoleManagement />
                }
            ]
        },
        {
            path: 'services',
            children: [
                {
                    path: 'databases',
                    element: <Databases />
                },
                {
                    path: 'docker',
                    element: <Docker />
                },
                {
                    path: 'hadoop',
                    element: <Hadoop />
                },
                {
                    path: 'kubernetes',
                    element: <Kubernetes/>
                },
                {
                    path: 'instances',
                    element: <Instances />
                }
            ]
        }
    ]
};

export default MainRoutes;
