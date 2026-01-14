import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiUser } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';
import { AuthContext } from '../../contexts/AuthContext';

export default function Header() {
  const { signed, loadingAuth } = useContext(AuthContext);

  console.log('signed: ', signed, '\nloadingAuth: ', loadingAuth)

  return (
    <header className='w-full flex justify-center items-center h-16 bg-white drop-shadow mb-4'>
      <nav className='flex w-full max-w-7xl items-center justify-between px-4 mx-auto'>
        <Link to=''>
          <img
            src={logoImg}
            alt='Logo Web Carros'
          />
        </Link>

        {!loadingAuth && signed && (
          <Link to='/dashboard'>
            <div className="border-2 rounded-full p-1">
              <FiUser size={24} color='#000' title='Perfil' />
            </div>
          </Link>
        )}

        {!loadingAuth && !signed && (
          <Link to='/login'>
            <div className="border-2 rounded-full p-1">
              <FiLogIn size={24} color='#000' title='Login' />
            </div>
          </Link>
        )}
      </nav>
    </header>
  )
}