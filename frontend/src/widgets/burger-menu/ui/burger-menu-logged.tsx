'use client'
import classNames from 'classnames'
import cls from './burger-menu.module.scss'
import { useBurgerMenu } from '@/shared/burger-menu'
import { ReactElement } from 'react'
import { UrlObject } from 'url'
import { Link } from '@/i18n/navigation'

type MenuTab = {
  href: string | UrlObject
  label: string
  icon: ReactElement
  status?: string
}


type Props = {
  logout: ReactElement
  menuTabs: MenuTab[]
  onClickMenuTab: () => void
  requestProgressBar: ReactElement
  profileSection: ReactElement
}


function BurgerMenuLogged(props: Props) {
  const {} = props

  const burgerMenu = useBurgerMenu()

  return (
    <div 
      className={classNames(cls.BurgerMenu, {
        [cls.active]: burgerMenu.opened,
        [cls.loggedIn]: true,
      })}
      ref={burgerMenu.ref}
    >
      {props.profileSection}
      {props.requestProgressBar}

      {props.menuTabs && <div className={cls.menuTabs}>
        {props.menuTabs.map(t => <Link
          href={t.href}
          key={t.label}
          onClick={props.onClickMenuTab}
        >
          {t.icon}
          <span>{t.label}</span>
          {t.status && <div>{t.status}</div>}
        </Link>)}
      </div>}

      {props.logout}

    </div>
  )
}

export { BurgerMenuLogged }
export type { MenuTab }