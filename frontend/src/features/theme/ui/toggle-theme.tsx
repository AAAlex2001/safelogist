'use client'
import SunIcon from '@/icons/SunIcon'
import cls from './toggle-theme.module.scss'

type Props = {

}

function ToggleTheme(props: Props) {
  const {} = props

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      className={cls.ToggleTheme}
      aria-label="Сменить тему"
      onClick={toggleTheme}
    >
      <SunIcon />
    </button>
  )
}

export { ToggleTheme }