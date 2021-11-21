import { withAuthenticationRequired } from "@auth0/auth0-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useExchanges, useUpdateSettings, useUser } from "@perfolio/pkg/hooks"
import { AppLayout, SideNavbar } from "@perfolio/ui/app"
import { Button, ButtonType } from "@perfolio/ui/components"
import { Card } from "@perfolio/ui/components"
import { Field, Form, handleSubmit } from "@perfolio/ui/form"
import { GetStaticProps, NextPage } from "next"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { CheckIcon } from "@heroicons/react/outline"
import { getTranslations, useI18n } from "@perfolio/pkg/i18n"
import { useToaster } from "@perfolio/pkg/toaster"

interface SettingProps {
  validation: z.AnyZodObject
  title: string
  footer: string
  onSubmit: (values: Record<string, string | number>) => Promise<void>
  button?: {
    label?: string
    type?: ButtonType
  }
}

const Setting: React.FC<SettingProps> = ({
  validation,
  title,
  footer,
  children,
  onSubmit,
  button,
}): JSX.Element => {
  const ctx = useForm<z.infer<typeof validation>>({
    mode: "onBlur",
    resolver: zodResolver(validation),
  })
  const { t } = useI18n()
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  return (
    <Card>
      <Card.Header>
        <Card.Header.Title title={title} />
      </Card.Header>

      <Card.Content>
        <Form ctx={ctx} formError={formError}>
          {children}
        </Form>
      </Card.Content>
      <Card.Footer>
        <Card.Footer.Status>{footer}</Card.Footer.Status>
        <Card.Footer.Actions>
          <Button
            loading={submitting}
            // eslint-disable-next-line
            // @ts-ignore
            onClick={() =>
              handleSubmit<z.infer<typeof validation>>(
                ctx,
                onSubmit,
                setSubmitting,
                setFormError,
              )}
            type={button?.type ?? "primary"}
            htmlType="submit"
            disabled={ctx.formState.isSubmitting}
          >
            {button?.label ?? t("setButtonLabelSave")}
          </Button>
        </Card.Footer.Actions>
      </Card.Footer>
    </Card>
  )
}

/**
 * / page.
 */

interface PageProps {
  translations: Record<string, string>
}

const SettingsPage: NextPage<PageProps> = ({ translations }) => {
  const { t } = useI18n(translations)
  const { user } = useUser()
  console.log({ user })

  const { exchanges } = useExchanges()
  console.log({ exchanges })
  const toast = useToaster()

  /**
   * The current defaultExchange
   */

  const currencyValidation = z.object({
    defaultCurrency: z.string().min(3).max(3),
  })

  const updateSettings = useUpdateSettings()
  const onCurrencySubmit = async (
    values: z.infer<typeof currencyValidation>,
  ): Promise<void> => {
    const res = await updateSettings.mutateAsync({
      settings: { defaultCurrency: values.defaultCurrency },
    })
    toast.addToast({
      icon: <CheckIcon />,
      title: "Success",
      content: `Updated currency to ${res.updateSettings.defaultCurrency}`,
    })
  }

  const exchangeValidation = z.object({
    defaultRegion: z.string(),
    defaultExchange: z.string(),
  })
  const onExchangeSubmit = async (
    values: z.infer<typeof exchangeValidation>,
  ): Promise<void> => {
    const res = await updateSettings.mutateAsync({
      settings: {
        defaultExchangeId: exchanges?.find(
          (e) => e.description === values.defaultExchange,
        )?.mic,
      },
    })
    toast.addToast({
      icon: <CheckIcon />,
      title: "Success",
      content: `Updated default exchange to ${res.updateSettings.defaultExchange.mic}`,
    })
  }

  const [region, setRegion] = useState<string>(
    user?.settings?.defaultExchange?.region ?? "",
  )

  return (
    <AppLayout side="left" sidebar={<SideNavbar />}>
      <div className="space-y-8">
        <Setting
          title={t("setStocksCurrencyTitle")}
          footer={t("setStocksCurrencyFooter")}
          validation={currencyValidation}
          onSubmit={onCurrencySubmit as (
            values: Record<string, string | number>,
          ) => Promise<void>}
        >
          <Field.Input
            label={t("setStocksCurrencyLabel")}
            hideLabel
            name="defaultCurrency"
            type="text"
            defaultValue={user?.settings?.defaultCurrency ?? ""}
          />
        </Setting>
        <Setting
          title={t("setStocksStockExTitle")}
          footer={t("setStocksStockExFooter")}
          validation={exchangeValidation}
          onSubmit={onExchangeSubmit as (
            values: Record<string, string | number>,
          ) => Promise<void>}
        >
          <div className="items-center gap-4 md:flex">
            <Field.Select
              onChange={setRegion}
              options={[...new Set(exchanges?.map((e) => e.region))] ?? []}
              label="Region"
              name="defaultRegion"
              defaultValue={user?.settings?.defaultExchange.region}
            />
            <Field.Select
              options={exchanges
                ?.filter((e) => e.region === region)
                .map((e) => e.description) ?? []}
              label={t("setStocksStockExSelect")}
              name="defaultExchange"
              defaultValue={user?.settings?.defaultExchange?.description ?? ""}
            />
          </div>
        </Setting>
      </div>
    </AppLayout>
  )
}
export default withAuthenticationRequired(SettingsPage)

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  const translations = await getTranslations(locale, ["app"])
  return {
    props: {
      translations,
    },
  }
}
