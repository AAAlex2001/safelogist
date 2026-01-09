import { Link } from '@/i18n/navigation'
import { Button } from '@/components/button/Button'
import cls from './shared.module.scss'
import { useTranslations } from 'next-intl'

type Props = {
  onClick?: () => void
  fullWidth?: boolean
}

function GoToRegistration(props: Props) {
  const {
    fullWidth
  } = props
  const t = useTranslations('Header');

  return (
    <Link href="/register" onClick={props.onClick}>
      <Button 
        className={fullWidth ? undefined : cls.registerButton}
        fullWidth={fullWidth}
      >
        {t('register')}
      </Button>
    </Link>
  )
}

export { GoToRegistration }