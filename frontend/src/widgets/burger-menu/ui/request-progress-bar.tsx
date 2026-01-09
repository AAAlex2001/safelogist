import { useTranslations } from 'next-intl';
import cls from './request-progress-bar.module.scss'

type Props = {
  availableRequests: number
  totalRequests: number

}

function RequestsProgressBar(props: Props) {
  const {} = props
  const t = useTranslations('Header');

  return (
    <div className={cls.requestsStats}>
      <div className={cls.requestsHeader}>
        <span className={cls.requestsLabel}>{t('requestsAvailable')}</span>
        <span className={cls.requestsCount}>{props.availableRequests} {t('of')} {props.totalRequests}</span>
      </div>
      <div className={cls.progressBar}>
        <div 
          className={cls.progressFill} 
          style={{ width: `${(props.availableRequests / props.totalRequests) * 100}%` }}
        />
      </div>
    </div>
  )
}

export { RequestsProgressBar }