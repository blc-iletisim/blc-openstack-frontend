// ** React Imports
import { useEffect, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import {useDispatch, useSelector} from 'react-redux'
import { handleLogout } from '@store/actions/auth'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather'
import {useSnackbar} from "notistack";

const UserDropdown = () => {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name font-weight-bold'>{auth?.user?.name}</span>
          
        </div>
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={() => {
          dispatch(handleLogout());
          enqueueSnackbar(
            "Çıkış yaptınız. Yönlendiriliyorsunuz...",
            {
              variant: 'info',
              preventDuplicate: true,
            },
          );
          history.replace('/login');
          window.location.reload();
        }}>
          <Power size={14} className='mr-75' />
          <span className='align-middle'>Çıkış yap</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
