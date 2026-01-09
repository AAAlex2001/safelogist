import { HTMLAttributes, ReactElement, cloneElement } from 'react'
import cls from './style.module.scss'

type IconProps = {
  className?: string
  width?: number
  height?: number
  size?: number
}

type Props = {
  children: ReactElement<IconProps>
} & HTMLAttributes<HTMLButtonElement>

function IconButton(props: Props) {
  const {
    children,
    ...restProps
  } = props

  const icon = cloneElement(props.children, {
    className: props.children.props.className,
    height: 22,
    width: 22,
    size: 22,
  })

  return (
    <button 
      className={cls.IconButton}
      {...restProps}
    >
      {icon}
    </button>
  )
}

export { IconButton }