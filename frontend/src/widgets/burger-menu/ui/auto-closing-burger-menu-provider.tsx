'use client'
import { useAuth } from '@/context/AuthContext'
import { BurgerMenuProvider } from '@/shared/burger-menu'
import { ReactNode } from 'react'

const AutoClosingBurgerMenuProvider = (props: {
  children: ReactNode
}) => {

  const { isLoggedIn } = useAuth()

  return <BurgerMenuProvider
    autoCloseBreakpoint={{
      point: 1440,
      preventCondition: isLoggedIn
    }}
  >
    {props.children}
  </BurgerMenuProvider>
}

export { AutoClosingBurgerMenuProvider } 