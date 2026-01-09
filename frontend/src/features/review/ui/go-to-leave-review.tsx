import { Link } from '@/i18n/navigation'
import { Button } from '@/components/button/Button'
import { useTranslations } from 'next-intl'

type Props = {
  onClick?: () => void
  fullWidth?: boolean
}

function GoToLeaveReview(props: Props) {
  const {
    fullWidth
  } = props
  const t = useTranslations('Header');

  return (
    <Link href="/reviews-profile/add" onClick={props.onClick}>
      <Button 
        variant="outline" 
        fullWidth={fullWidth}
      >
        {t('leaveReview')}
      </Button>
    </Link>
  )
}

export { GoToLeaveReview }