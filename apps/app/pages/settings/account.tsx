import React, { useState } from "react"
import { NextPage } from "next"
import { useForm } from "react-hook-form"
import { withAuthentication, WithSidebar } from "../../components"
import { useApi } from "@perfolio/data-access/api-client"
import { z } from "zod"
import { useRouter } from "next/router"
import { Button, LabeledField, Form2, handleSubmit } from "@perfolio/ui/components"
import { MailIcon, UserIcon } from "@heroicons/react/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useSession } from "next-auth/client"
import cn from "classnames"
import { Card } from "@perfolio/ui/design-system"

interface SettingProps {
  validation: z.ZodAny
  title: string
  footer: string
  fields: React.ReactNode
  onSubmit: (values: Record<string, string | number>) => Promise<void>
  button?: {
    label?: string
    kind?: string
  }
}

const Setting: React.FC<SettingProps> = ({
  validation,
  title,
  footer,
  fields,
  onSubmit,
  button,
}): JSX.Element => {
  const ctx = useForm<z.infer<typeof validation>>({
    mode: "onBlur",
    resolver: zodResolver(validation),
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  return (
    <Card>
      <Card.Title title={title} />

      <Card.Content>
        <Form2 ctx={ctx} formError={formError}>
          {fields}
        </Form2>
      </Card.Content>
      <Card.Footer>
        <Card.Footer.Status>{footer}</Card.Footer.Status>
        <Card.Footer.Actions>
          <Button
            loading={submitting}
            // eslint-disable-next-line
            // @ts-ignore
            onClick={() =>
              handleSubmit<z.infer<typeof validation>>(ctx, onSubmit, setSubmitting, setFormError)
            }
            kind={button?.kind ?? "primary"}
            size="small"
            label={button?.label ?? "Save"}
            type="submit"
            disabled={ctx.formState.isSubmitting}
          />
        </Card.Footer.Actions>
      </Card.Footer>
    </Card>
  )
}

/**
 * / page.
 */
const SettingsPage: NextPage = () => {
  const [session] = useSession()
  const router = useRouter()
  const api = useApi()
  const emailValidation = z.object({ email: z.string().email() })
  const onEmailSubmit = async (values: z.infer<typeof emailValidation>): Promise<void> => {
    return api.emails.sendEmailConfirmation(values)
  }
  const nameValidation = z.object({ name: z.string().min(3).max(64) })
  const onUsernameSubmit = async (values: z.infer<typeof nameValidation>): Promise<void> => {
    await api.settings.changeName(values)
  }

  const deleteValidation = z.object({
    confirmation: z
      .string()
      .refine(
        (s) => s.toLowerCase() === "delete my account forever",
        `Please enter "delete my account forever"`,
      ),
  })
  const onDeleteSubmit = async (): Promise<void> => {
    await api.settings.deleteAccount()
  }

  return (
    <WithSidebar
      side="left"
      sidebar={
        <div className="mt-4">
          <nav className="flex-grow pb-4 pr-4 md:block md:pb-0 md:overflow-y-auto">
            <ul className="space-y-4">
              <li>
                <Link href="/settings/account">
                  <a
                    className={cn(
                      "block px-4 py-2transition duration-500 ease-in-out transform focus:outline-none hover:text-black",
                      {
                        "font-semibold text-black": router.pathname === "/settings/account",
                        "text-gray-500": router.pathname !== "/settings/account",
                      },
                    )}
                  >
                    Account
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/settings/stocks">
                  <a
                    className={cn(
                      "block px-4 py-2transition duration-500 ease-in-out transform focus:outline-none hover:text-black",
                      {
                        "font-semibold text-black": router.pathname === "/settings/stocks",
                        "text-gray-500": router.pathname !== "/settings/stocks",
                      },
                    )}
                  >
                    Stocks
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      }
    >
      <div className="space-y-8">
        <Setting
          title="Email"
          footer="We will email you to verify the change"
          validation={emailValidation}
          onSubmit={onEmailSubmit as (values: Record<string, string | number>) => Promise<void>}
          fields={[
            <LabeledField
              disabled
              label="Email"
              hideLabel
              name="email"
              iconLeft={<MailIcon />}
              type="email"
              defaultValue={session?.user?.email ?? ""}
            />,
          ]}
        />
        <Setting
          title="Name"
          footer="Please use between 3 and 64 characters"
          validation={nameValidation}
          onSubmit={onUsernameSubmit as (values: Record<string, string | number>) => Promise<void>}
          fields={[
            <LabeledField
              label="Name"
              hideLabel
              name="name"
              iconLeft={<UserIcon />}
              type="text"
              defaultValue={session?.user?.name ?? ""}
            />,
          ]}
        />

        <Setting
          title="Delete Account"
          footer={`Enter "delete my account forever". This can not be undone. You will have to sign up for a new account again.`}
          validation={deleteValidation}
          onSubmit={onDeleteSubmit as (values: Record<string, string | number>) => Promise<void>}
          fields={[<LabeledField label="Confirm" hideLabel name="confirmation" type="text" />]}
          button={{ label: "Delete", kind: "alert" }}
        />
      </div>
    </WithSidebar>
  )
}

export default withAuthentication(SettingsPage)
