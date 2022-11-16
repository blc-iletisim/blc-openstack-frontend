import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

import '@styles/base/pages/page-misc.scss'

const Error = () => {
  return (
    <div className='misc-wrapper'>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Aradığınız sayfa bulunamadı! 🧐️</h2>
          <Button.Ripple tag={Link} to='/' color='primary' className='btn-block mb-2'>
            Anasayfa
          </Button.Ripple>
        </div>
      </div>
    </div>
  )
}
export default Error
