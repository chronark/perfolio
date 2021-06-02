import React, { useState } from "react"
import { Logo, Button } from "app/core/components"
import { Transition } from "@headlessui/react"
import { Link as NextLink, Routes } from "blitz"
export interface NavbarProps {
  links?: { label: string; href: string }[]
}

export const Navbar: React.FC<NavbarProps> = ({ links = [] }) => {
  const [scrolled, setScrolled] = useState(false)

  const handleScroll = () => {
    setScrolled(window.pageYOffset > 450)
  }

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll)
  }

  return (
    <nav className="w-screen px-8">
      <div className="relative flex flex-row flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
        <NextLink href={Routes.Home().pathname}>
          <a>
            <Logo withName />
          </a>
        </NextLink>

        {/* Desktop */}
        <div className="relative items-center hidden space-x-3 md:inline-flex md:ml-5 lg:justify-end">
          <Button
            href={Routes.SigninPage().pathname}
            label="Sign in"
            kind="plain"
          />
          <Button
            label="Start for free"
            kind="primary"
            href={Routes.SignupPage().pathname}
          />
        </div>
        {/* Mobile */}
        <Transition
          className="sm:hidden"
          show={scrolled}
          enter="transition ease-in-out duration-500 transform"
          enterFrom="translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
          leave="transition ease-in-out duration-500 transform"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="translate-x-full opacity-0"
        >
          <Button
            label="Start for free"
            kind="primary"
            href={Routes.SignupPage().pathname}
          />
        </Transition>
      </div>
    </nav>
  )
}