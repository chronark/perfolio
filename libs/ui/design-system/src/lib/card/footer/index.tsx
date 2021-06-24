import React from "react"

// eslint-disable-next-line
export interface CardFooterProps {}

export const CardFooter: React.FC<CardFooterProps> = ({ children }): JSX.Element => {
  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-300 bg-gray-50">
      {children}
    </div>
  )
}