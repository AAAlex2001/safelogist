import { Link } from '@/i18n/navigation'
import { Button } from '@/components/button/Button'
import { getTranslations } from 'next-intl/server'
import cls from './shared.module.scss'
import { useTranslations } from 'next-intl'

type Props = {
  onClick?: () => void
  fullWidth?: boolean
}

function GoToLogin(props: Props) {
  const {
    fullWidth
  } = props
  const t = useTranslations('Header');

  return (
    <Link href="/login" onClick={props.onClick}>
      <Button 
        variant="outline" 
        className={fullWidth ? undefined : cls.loginButton}
        fullWidth={fullWidth}
      >
        {t('login')}
      </Button>
    </Link>
  )
}

export { GoToLogin }