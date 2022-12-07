import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const UserManagement = Loadable(lazy(() => import('pages/management/userManagement')));
const RoleManagement = Loadable(lazy(() => import('pages/management/roleManagement')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'management',
            children: [
                {
                    path: 'users',
                    element: <DashboardDefault />
                },
                {
                    path: 'roles',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'services',
            children: [
                {
                    path: 'databases',
                    element: <DashboardDefault />
                },
                {
                    path: 'docker',
                    element: <DashboardDefault />
                },
                {
                    path: 'hadoop',
                    element: <DashboardDefault />
                },
                {
                    path: 'kubernetes',
                    element: <DashboardDefault />
                },
                {
                    path: 'instances',
                    element: <DashboardDefault />
                }
            ]
        }
    ]
};

export default MainRoutes;
