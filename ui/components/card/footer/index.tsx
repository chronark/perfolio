import React from "react"

// eslint-disable-next-line
export interface CardFooterProps {}

export const CardFooter: React.FC<CardFooterProps> = ({ children }): JSX.Element => {
  return (
    <div className="flex items-center justify-between p-4 sm:p-8 space-x-16 border-t border-gray-300 rounded-b bg-gray-50">
      {children}
    </div>
  )
}
