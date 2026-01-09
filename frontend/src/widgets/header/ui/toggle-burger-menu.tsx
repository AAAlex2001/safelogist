'use client'
import classNames from 'classnames'
import { useTranslations } from 'next-intl';
import cls from './toggle-burger-menu.module.scss'

type Props = {
  onClick: () => void
  active: boolean
}

function ToggleBurgerMenu(props: Props) {
  const {} = props

  const t = useTranslations('Header');


  return (
    <button
      className={classNames(cls.ToggleButton, {
        [cls.active]: props.active
      })}
      aria-label={t('menu')}
      onClick={props.onClick}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  )
}

export { ToggleBurgerMenu }