import React from "react"

// eslint-disable-next-line
export interface RootProps {}

export const Root: React.FC<RootProps> = ({ children }): JSX.Element => {
  return <div className="overflow-hidden bg-white border border-gray-300 rounded">{children}</div>
}
