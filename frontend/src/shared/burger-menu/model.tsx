'use client'
import { ReactNode, Ref, RefObject, createContext, useContext, useEffect, useRef, useState } from "react";

type BurgerMenu = {
  opened: boolean
  toggle: () => void
  open: () => void
  close: () => void
  ref: Ref<HTMLDivElement | null>
}

//@ts-ignore
const Context = createContext<BurgerMenu>(undefined)

type AutoCloseBreakpoint = {
  point: number
  preventCondition?: boolean
}

const useAutoCloseBurgerMenuOnBigScreen = (
  close: Function,
  autoCloseBreakpoint?: AutoCloseBreakpoint,
) => {

  useEffect(() => {
    // Не добавляем слушаетель на закрытие, если не передан брейк-поинт
    // или preventCondition = true
    if (!autoCloseBreakpoint || autoCloseBreakpoint.preventCondition) return
    const onResize = () => {
      if (innerWidth >= autoCloseBreakpoint.point) {
        close()
      }
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [
    autoCloseBreakpoint?.preventCondition, 
    autoCloseBreakpoint?.point,
  ])
}

const useCloseOnClickOutside = (
  close: Function, 
  opened: boolean, 
  ref: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    if (!opened) return 
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [opened]);
}

type Props = {
  children: ReactNode
  autoCloseBreakpoint?: AutoCloseBreakpoint
}


function BurgerMenuProvider(props: Props) {
  const [opened, setOpened] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const toggle = () => setOpened(prev => !prev)
  const open = () => setOpened(true)
  const close = () => setOpened(false)

  useAutoCloseBurgerMenuOnBigScreen(close, props.autoCloseBreakpoint)

  useCloseOnClickOutside(close, opened, ref)

  return <Context.Provider
    value={{
      opened,
      toggle,
      close,
      open,
      ref,
    }}
  >
    {props.children}
  </Context.Provider>
}

const useBurgerMenu = () => {
  return useContext(Context)
}

export {
  BurgerMenuProvider,
  useBurgerMenu,
}