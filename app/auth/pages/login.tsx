import { useRouter, BlitzPage } from "blitz"
import { LoginForm } from "app/auth/components/LoginForm"
import { AuthPageTemplate } from "../components/template"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <AuthPageTemplate h1="Login" h2="Kevin ist ein frischer Hecht!">
      <LoginForm
        onSuccess={() => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
          router.push(next)
        }}
      />
    </AuthPageTemplate>
  )
}

LoginPage.redirectAuthenticatedTo = "/"

export default LoginPage
