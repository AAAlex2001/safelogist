'use client'
import { useTranslations } from "next-intl"
import { ToggleTheme } from "@/features/theme"
import { SelectLanguage } from "@/features/language"
import { GoToLogin, GoToRegistration } from "@/features/authentication"
import { SelectRegion } from "@/features/region"
import { useBurgerMenu } from "@/shared/burger-menu"
import { IconButton } from "@/components/icon-button"
import { useAuth } from "@/context/AuthContext"
import UserIcon from "@/icons/UserIcon"
import NotificationIcon from "@/icons/NotificationIcon"
import SettingsIcon from "@/icons/SettingsIcon"
import { HeaderIconsActions, HeaderLayout, NavLink } from "./header-layout"
import { Logo } from "./logo"
import { ToggleBurgerMenu } from "./toggle-burger-menu"

type Props = {

}


function Header(props: Props) {
  const {} = props

  const t = useTranslations('Header')
  const { isLoggedIn } = useAuth()
  const burgerMenu = useBurgerMenu()

  if (isLoggedIn) {
    return (
      <HeaderLayout
        logged
        logo={<Logo
          href="/reviews"
        />}

        rightSection={<>
          <SelectRegion/>
          <HeaderIconsActions>
            <IconButton 
              aria-label="Уведомления"
              children={<NotificationIcon />}
            />
            <IconButton 
              aria-label="Настройки"
              children={<SettingsIcon />}
            />
            <IconButton 
              aria-label="Профиль"
              onClick={burgerMenu.toggle}
              children={<UserIcon />}
            />
            
          </HeaderIconsActions>
        </>}

        toggleBurgerMenu={<ToggleBurgerMenu
          onClick={burgerMenu.toggle}
          active={burgerMenu.opened}
        />}
      />
      )
  }

  const links: NavLink[] = [
    {href: '/reviews', label: t('about')},
    {href: '/reviews', label: t('features')},
    {href: '/reviews', label: t('pricing')},
    {href: '/reviews', label: t('contacts')},
  ]
  

  return (
    <HeaderLayout
      logo={<Logo
        href="/reviews"
      />}

      navigationLinks={links}

      controls={<>
        <ToggleTheme/>
        <SelectLanguage/>
      </>}

      rightSection={<>
        <GoToLogin/>
        <GoToRegistration/>
      </>}

      toggleBurgerMenu={<ToggleBurgerMenu
        onClick={burgerMenu.toggle}
        active={burgerMenu.opened}
      />}
    />

  )
}

export { Header }