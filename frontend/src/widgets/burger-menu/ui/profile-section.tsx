import UserIcon from '@/icons/UserIcon'
import cls from './profile-section.module.scss'

type Props = {
  avatarSrc: string | undefined | null
  name: string | undefined | null
  email: string | undefined | null
  plan: string  | undefined | null
}

function ProfileSection(props: Props) {
  const {
    name,
    avatarSrc,
    email,
    plan,
  } = props

  return (
    <div className={cls.profileSection}>
      <div className={cls.userInfo}>
        <div className={cls.avatarCircle}>
          {avatarSrc ? (
            <img 
              src={avatarSrc} 
              alt={name || ''}
              className={cls.avatarPhoto}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div className={cls.userDetails}>
          <div className={cls.userName}>{name || "User"}</div>
          <div className={cls.userEmail}>{email || ""}</div>
          <div className={cls.userPlan}>{plan}</div>
        </div>
      </div>
    </div>
  )
}

export { ProfileSection }