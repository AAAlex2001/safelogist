import LogoutIcon from '@/icons/LogoutIcon';
import cls from './logout.module.scss'
import { useAuth } from '@/context/AuthContext';

type Props = {
  onBeforeLogout: () => void 
}

function Logout(props: Props) {
  const { onBeforeLogout } = props

  const { logout } = useAuth()

  return (
    <button className={cls.logoutButton} onClick={() => { onBeforeLogout(); logout();  }}>
      <LogoutIcon/>
      <span>Выйти</span>
    </button>
  )
}

export { Logout }