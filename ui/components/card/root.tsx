import React from "react"
import cn from "classnames"

// eslint-disable-next-line
export interface RootProps {
  border?: boolean
}

export const Root: React.FC<RootProps> = ({ border = true, children }): JSX.Element => {
  return (
    <div
      className={cn("w-full space-y-4 sm:space-y-8 bg-white rounded overflow-hidden", {
        "border border-gray-300": border === true,
      })}
    >
      {children}
    </div>
  )
}
