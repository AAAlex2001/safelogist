'use client'
import { useAuth } from "@/context/AuthContext"
import { BurgerMenuDefault, NavLink } from "./burger-menu-default"
import { BurgerMenuLogged, MenuTab } from "./burger-menu-logged"
import { GoToLogin, GoToRegistration, Logout } from "@/features/authentication"
import { ToggleTheme } from "@/features/theme"
import { SelectLanguage } from "@/features/language"
import { useBurgerMenu } from "@/shared/burger-menu"
import { GoToLeaveReview } from "@/features/review"
import { useTranslations } from "next-intl"
import ReviewIcon from "@/icons/ReviewIcon"
import SettingsIcon from "@/icons/SettingsIcon"
import ProfileIcon from "@/icons/ProfileIcon"
import PaymentIcon from "@/icons/PaymentIcon"
import { RequestsProgressBar } from "./request-progress-bar"
import { ProfileSection } from "./profile-section"

type Props = {

}

function BurgerMenu(props: Props) {
  const {} = props

  const { isLoggedIn, userData } = useAuth()
  const burgerMenu = useBurgerMenu()
  const t = useTranslations('Header')

  if (isLoggedIn) {

    const tabs: MenuTab[] = [
      {href: '/reviews-profile', label: 'Мои отзывы', icon: <ReviewIcon color={'var(--text-secondary)'}/>},
      {href: '/settings', label: 'Настройки', icon: <SettingsIcon color={'var(--text-secondary)'}/>},
      {href: '/profile', label: 'Профиль', icon: <ProfileIcon color={'var(--text-secondary)'}/>},
      {href: '/pricing', label: 'Тарифы и оплата', icon: <PaymentIcon color={'var(--text-secondary)'}/>, status: 'В разработке'},
    ]

    return <BurgerMenuLogged
      profileSection={<ProfileSection
        avatarSrc={userData?.photo}
        email={userData?.email}
        name={userData?.name}
        plan={"Enterprise+"}
      />}

      requestProgressBar={<RequestsProgressBar
        availableRequests={234}
        totalRequests={500}
      />}

      menuTabs={tabs}
      onClickMenuTab={burgerMenu.close}

      logout={<Logout
        onBeforeLogout={burgerMenu.close}
      />}
    />
  }

  const links: NavLink[] = [
    {href: '/reviews', label: t('about')},
    {href: '/reviews', label: t('features')},
    {href: '/reviews', label: t('pricing')},
    {href: '/reviews', label: t('contacts')},
  ]

  return (
    <BurgerMenuDefault
      top={<>
        <GoToLeaveReview
          fullWidth
          onClick={burgerMenu.close}
        />
      </>}

      navigationLinks={links}
      onClickNavLink={burgerMenu.close}

      rowActions={<>
        <ToggleTheme/>
        <SelectLanguage/>
      </>}
      
      footer={<>
        <GoToLogin 
          fullWidth
          onClick={burgerMenu.close}
        />
        <GoToRegistration 
          fullWidth
          onClick={burgerMenu.close}
        />
      </>}
    />
  )
}

export { BurgerMenu }