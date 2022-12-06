// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
    LoginOutlined,
    ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const services = {
    id: 'group-services',
    title: 'Services',
    type: 'group',
    children: [
        {
            id: 'database',
            title: 'Database',
            type: 'item',
            url: '/databases',
            icon: icons.LoginOutlined,
            target: false
        },
        {
            id: 'docker',
            title: 'Docker',
            type: 'item',
            url: '/docker',
            icon: icons.ProfileOutlined,
            target: false
        },
        {
            id: 'hadoop',
            title: 'Hadoop',
            type: 'item',
            url: '/hadoop',
            icon: icons.ProfileOutlined,
            target: false
        },
        {
            id: 'kubernetes',
            title: 'Kubernetes',
            type: 'item',
            url: '/kubernetes',
            icon: icons.ProfileOutlined,
            target: false
        },{
            id: 'instance',
            title: 'Instance',
            type: 'item',
            url: '/instance',
            icon: icons.ProfileOutlined,
            target: false
        }
    ]
};

export default services;
