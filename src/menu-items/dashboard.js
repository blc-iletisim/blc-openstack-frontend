// assets
import {HomeOutlined, UserOutlined, UserSwitchOutlined} from '@ant-design/icons';

// icons
const icons = {
    HomeOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const management = {
    id: 'group-dashboard',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/',
            icon: icons.HomeOutlined,
            breadcrumbs: false
        }
    ]
};

export default management;
