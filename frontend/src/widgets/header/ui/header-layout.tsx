import { ReactElement, ReactNode } from 'react'
import cls from './header-layout.module.scss'
import { Link } from '@/i18n/navigation'
import { UrlObject } from 'url'
import classNames from 'classnames'

type NavLink = {
  href: string | UrlObject
  label: string
}

type Props = {
  logo: ReactElement
  toggleBurgerMenu: ReactElement
  controls?: ReactNode
  rightSection?: ReactNode
  navigationLinks?: NavLink[]
  logged?: boolean
}

function HeaderLayout(props: Props) {
  const {} = props

  return (
    <header className={cls.HeaderLayout}>
      <div className={classNames(
        cls.HeaderLayout_container,
        {
          [cls.logged]: props.logged
        }
      )}>
        <div className={cls.HeaderLayout_Left}>
          {props.logo}
        </div>

        {props.navigationLinks && <nav 
          className={cls.HeaderLayout_Nav} 
          id="headerNav"
        >
          {props.navigationLinks.map(l => (<Link
            href={l.href}
            className={cls.navLink}
            key={l.label}
          >
            {l.label}
          </Link>))}
        </nav>}

        {props.controls && <div 
          className={cls.HeaderLayout_Controls}
        >
          {props.controls}
        </div>}

        {props.rightSection && <div 
          className={cls.HeaderLayout_HeaderRight}
        >
          {props.rightSection}
        </div>}

        {props.toggleBurgerMenu}
      </div>
    </header>
  )
}

function HeaderIconsActions(props: {
  children: ReactNode
}) {
  return <div className={cls.userIcons}>
    {props.children}
  </div>
}

export { HeaderLayout, HeaderIconsActions }
export type { NavLink}
