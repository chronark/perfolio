import React, { useState } from "react"
import { NextPage } from "next"
import { Logo } from "@perfolio/ui/components"
import { RequestForm, VerifyForm } from "@perfolio/app/components"
import { useRouter } from "next/router"
import { useAccessToken } from "@perfolio/hooks"
const SigninPage: NextPage = () => {
  const [email, setEmail] = useState<undefined | string>(undefined)
  const router = useRouter()
  const { accessToken } = useAccessToken()
  if (accessToken) {
    router.push("/")
  }

  const adminEmail = router.query["email"]
  const adminToken = router.query["token"]

  if (adminEmail && adminToken) {
    console.log({ adminEmail, adminToken })
    fetch("/api/auth/admin", {
      method: "POST",
      body: JSON.stringify({ email: adminEmail, token: adminToken }),
    }).then((res) => {
      if (res.status === 200) {
        router.push("/")
      }
    })
  }

  return (
    <section className="relative w-screen h-screen bg-white ">
      <div className="container w-full h-full mx-auto">
        <div className="flex flex-col items-center justify-center w-full h-full md:flex-row">
          <div className="relative items-center justify-center hidden w-1/2 h-full md:flex md:flex-col bg-gradient-to-r from-white to-gray-100">
            <div className="absolute inset-y-0 items-center justify-center hidden w-full h-full md:flex">
              <svg
                className="z-0 w-full h-full p-8 text-gray-100 fill-current"
                viewBox="0 0 354 283"
                fill="fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M247.35 70.671L176.678 0 0 176.678l35.336 35.336L176.678 70.671l35.336 35.336 35.336-35.336zM106.007 212.014l70.671 70.671 176.679-176.678-35.336-35.336-141.343 141.343-35.335-35.336-35.336 35.336z" />
              </svg>
            </div>
            <div className="z-50 flex flex-col items-center justify-center px-8 space-y-4 tracking-tight text-center md:text-left md:items-start md:justify-start md:max-w-3xl">
              <h1 className="text-4xl font-bold text-gray-900 xl:text-7xl">Sign in</h1>
              <h2 className="text-lg font-normal text-gray-500 ">
                One account - All of your portfolio!
              </h2>
            </div>
          </div>
          <div className="w-full max-w-md px-6 space-y-4">
            {!email ? (
              <RequestForm onSuccess={(email: string) => setEmail(email)} />
            ) : (
              <VerifyForm onSuccess={() => router.push("/")} email={email} />
            )}
          </div>
          <div className="absolute flex items-center justify-between w-full md:hidden top-12">
            <span className="w-4/5 border-b border-primary00"></span>

            <span className="flex justify-center w-full text-gray-900 md:hidden ">
              <Logo withName />
            </span>

            <span className="w-4/5 border-b border-primary00"></span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SigninPage