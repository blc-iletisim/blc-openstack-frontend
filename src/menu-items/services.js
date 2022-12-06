// assets
import { DatabaseOutlined, ProfileOutlined } from '@ant-design/icons';
import { FaDocker } from 'react-icons/fa';
import { GrHadoop } from 'react-icons/gr';
import { SiKubernetes } from 'react-icons/si';
import { BsFillInboxesFill } from 'react-icons/bs';

// icons
const icons = {
    DatabaseOutlined,
    FaDocker,
    GrHadoop,
    SiKubernetes,
    BsFillInboxesFill
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const services = {
    id: 'group-services',
    title: 'Services',
    type: 'group',
    children: [
        {
            id: 'databases',
            title: 'Databases',
            type: 'item',
            url: '/databases',
            icon: icons.DatabaseOutlined,
            target: false
        },
        {
            id: 'docker',
            title: 'Docker',
            type: 'item',
            url: '/docker',
            icon: icons.FaDocker,
            target: false
        },
        {
            id: 'hadoop',
            title: 'Hadoop',
            type: 'item',
            url: '/hadoop',
            icon: icons.GrHadoop,
            target: false
        },
        {
            id: 'kubernetes',
            title: 'Kubernetes',
            type: 'item',
            url: '/kubernetes',
            icon: icons.SiKubernetes,
            target: false
        },{
            id: 'instances',
            title: 'Instances',
            type: 'item',
            url: '/instances',
            icon: icons.BsFillInboxesFill,
            target: false
        }
    ]
};

export default services;
