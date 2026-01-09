'use client'
import classNames from 'classnames'
import cls from './burger-menu.module.scss'
import { useBurgerMenu } from '@/shared/burger-menu'
import { ReactElement, ReactNode } from 'react'
import { UrlObject } from 'url'
import { Link } from '@/i18n/navigation'

type NavLink = {
  href: string | UrlObject
  label: string
}

type Props = {
  rowActions: ReactElement
  top: ReactNode
  footer: ReactNode
  navigationLinks: NavLink[]
  onClickNavLink: () => void
}


function BurgerMenuDefault(props: Props) {
  const {} = props

  const burgerMenu = useBurgerMenu()

  return (
    <div className={classNames(cls.BurgerMenu, {
      [cls.active]: burgerMenu.opened,
    })}
      ref={burgerMenu.ref}
    >
      {props.top && <div className={cls.buttonsContainer}>
        {props.top}
      </div>}

      {props.navigationLinks && <div className={cls.navigation}>
        {props.navigationLinks.map(l => <Link
          href={l.href}
          key={l.label}
          className={cls.navLink} 
          onClick={props.onClickNavLink}
        >
          {l.label}
        </Link>)}  
      </div>}

      {props.rowActions && <div className={cls.themeLangContainer}>
        {props.rowActions}
      </div>}

      {props.footer && <div className={cls.buttonsContainer}>
        {props.footer}
      </div>}
    </div>
  )
}


export { BurgerMenuDefault }
export type { NavLink }