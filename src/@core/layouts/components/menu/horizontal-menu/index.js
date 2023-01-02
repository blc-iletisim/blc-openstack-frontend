// ** React Imports
import { useState } from 'react'

// ** Horizontal Menu Array
import navigation from '@src/navigation/horizontal'
import navigationUser from '@src/navigation/horizontalUser'
import navigationModerator from '@src/navigation/horizontalModerator'
// ** Horizontal Menu Components
import HorizontalNavMenuItems from './HorizontalNavMenuItems'
import {useDispatch, useSelector} from "react-redux";
import  secureLocalStorage  from  "react-secure-storage";

//const currentUserRole= sessionStorage.getItem("currentUserRole")
const currentUserRole= secureLocalStorage.getItem('currentUserRole');
  console.log("currentUserRoleee: ",currentUserRole)

const HorizontalMenu = ({ currentActiveItem, routerProps }) => {
  // ** States
  const [activeItem, setActiveItem] = useState(null)
  const [groupActive, setGroupActive] = useState([])
  const [openDropdown, setOpenDropdown] = useState([])
  const authStore = useSelector((state) => state.auth);
  console.log("authStoreee: ",authStore)
  const currentUserRole= secureLocalStorage.getItem('currentUserRole');
  console.log("currentUserRole2: ",currentUserRole)
  // ** On mouse enter push the ID to openDropdown array
  const onMouseEnter = id => {
    const arr = openDropdown
    arr.push(id)
    setOpenDropdown([...arr])
  }

  // ** On mouse leave remove the ID to openDropdown array
  const onMouseLeave = id => {
    const arr = openDropdown
    arr.splice(arr.indexOf(id), 1)
    setOpenDropdown([...arr])
  }

  const handlePage = () => {
    switch(currentUserRole) {
      case 'ADMIN':
        return navigation;
      case 'MODERATOR':
        return navigationModerator;
      default:
        return navigationUser;
    }
  }
  
  return (
    <div className='navbar-container main-menu-content'>
      <ul className='nav navbar-nav' id='main-menu-navigation'>
        <HorizontalNavMenuItems
          submenu={false}
          items={ handlePage() }
          //items={ (currentUserRole!=="ADMIN")?navigationUser:navigation}
          activeItem={activeItem}
          groupActive={groupActive}
          routerProps={routerProps}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          openDropdown={openDropdown}
          setActiveItem={setActiveItem}
          setGroupActive={setGroupActive}
          setOpenDropdown={setOpenDropdown}
          currentActiveItem={currentActiveItem}
        />
      </ul>
    </div>
  )
}

export default HorizontalMenu
