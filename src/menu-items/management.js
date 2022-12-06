// assets
import {UserOutlined, UserSwitchOutlined} from '@ant-design/icons';

// icons
const icons = {
    UserOutlined,
    UserSwitchOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const management = {
    id: 'group-management',
    title: 'Management',
    type: 'group',
    children: [
        {
            id: 'userManagement',
            title: 'User Management',
            type: 'item',
            url: '/users',
            icon: icons.UserOutlined,
            breadcrumbs: false
        },
        {
            id: 'roleManagement',
            title: 'RoleManagement',
            type: 'item',
            url: '/roles',
            icon: icons.UserSwitchOutlined,
            breadcrumbs: false
        }
    ]
};

export default management;
