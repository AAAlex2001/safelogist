import { Link } from '@/i18n/navigation'
import { UrlObject } from 'url'
import LogoIcon from '@/icons/LogoIcon'
import cls from './logo.module.scss'

type Props = {
  href: string | UrlObject
}

function Logo(props: Props) {
  const {} = props

  return (
    <Link href={props.href} className={cls.logoLink} aria-label="SafeLogist">
      <div className={cls.logo}>
        <LogoIcon />
      </div>
    </Link>
  )
}

export { Logo }