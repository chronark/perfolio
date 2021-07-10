import type { AppProps } from "next/app"
import { QueryClientProvider, QueryClient } from "react-query"
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/clerk-react"
import { JWTProvider } from "@perfolio/data-access/api-client"
// import { PersistentQueryClient } from "@perfolio/integrations/localstorage"
import Head from "next/head"
import LogRocket from "logrocket"
import { OnboardingModal } from "@perfolio/app/middleware"
import { IdProvider } from "@radix-ui/react-id"
import "tailwindcss/tailwind.css"
import { useRouter } from "next/router"

LogRocket.init("perfolio/app")

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const frontendApi = process.env["NEXT_PUBLIC_CLERK_FRONTEND_API"]
  return (
    <>
      <Head>
        <title>Perfolio</title>
        <meta name="description" content="Insights. For Everyone." />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png"></link>
      </Head>
      <IdProvider>
        <ClerkProvider frontendApi={frontendApi} navigate={(to) => router.push(to)}>
          <SignedIn>
            <QueryClientProvider client={new QueryClient()}>
              <JWTProvider>
                <OnboardingModal />
                <div className={`${process.env.NODE_ENV !== "production" ? "debug-screens" : ""}`}>
                  <Component {...pageProps} />
                </div>
              </JWTProvider>
            </QueryClientProvider>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center justify-center">
              <SignIn />
            </div>
          </SignedOut>
        </ClerkProvider>
      </IdProvider>
    </>
  )
}
export default MyApp
