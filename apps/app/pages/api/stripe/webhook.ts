import { Stripe } from "stripe"
import { env } from "@chronark/env"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import { Logger } from "tslog"
import { buffer } from "micro"
import { PrismaClient } from "@perfolio/integrations/prisma"
import { ManagementClient } from "auth0"

const subscriptionValidation = z.object({
  id: z.string(),
  object: z.string().refine((object) => object === "subscription"),
  current_period_end: z.number().int(),
  current_period_start: z.number().int(),
  customer: z.string(),
  status: z.enum([
    "incomplete",
    "incomplete_expired",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
  ]),
  items: z.object({
    data: z.array(
      z.object({
        price: z.object({
          product: z.string(),
        }),
      }),
    ),
  }),
})

const requestValidation = z.object({
  method: z.string().refine((m) => m === "POST"),
  headers: z.object({
    "stripe-signature": z.string(),
  }),
})

const prisma = new PrismaClient()

const auth0 = new ManagementClient({
  domain: env.require("NEXT_PUBLIC_AUTH0_DOMAIN"),
  clientId: env.require("AUTH0_MANAGEMENT_CLIENT_ID"),
  clientSecret: env.require("AUTH0_MANAGEMENT_CLIENT_SECRET"),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const logger = new Logger({ name: "Stripe Webhook" })
  try {
    const {
      headers: { "stripe-signature": signature },
    } = requestValidation.parse(req)

    const stripe = new Stripe(env.require("STRIPE_SECRET_KEY"), {
      apiVersion: "2020-08-27",
      typescript: true,
    })

    const event = stripe.webhooks.constructEvent(
      (await buffer(req)).toString(),
      signature,
      env.require("STRIPE_WEBHOOK_SECRET"),
    )

    if (event.type.startsWith("customer.subscription")) {
      const subscription = subscriptionValidation.parse(event.data.object)

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: subscription.customer },
      })
      if (!user) {
        throw new Error("User not found")
      }

      const authRoles: Record<string, string> = {
        pro: "rol_Rjy99HLtin8ryEds",
        premium: "rol_ByfhbMJUPC3PlhpD",
      }
      const products: Record<string, string> = {
        prod_K8L177Ou3esVrr: "pro",
        prod_K8L2zOY0pLY68n: "premium",
      }

      logger.debug(subscription.items.data[0])
      const productId = subscription.items.data[0].price.product as string
      const product = products[productId]
      const role = authRoles[product]

      if (
        event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated"
      ) {
        await auth0.assignRolestoUser({ id: user.id }, { roles: [role] })
      } else if (event.type === "customer.subscription.deleted") {
        await auth0.removeRolesFromUser({ id: user.id }, { roles: [role] })
      } else if (event.type === "customer.subscription.trial_will_end") {
        // Occurs three days before a subscription's trial period is scheduled to end,
        // or when a trial is ended immediately (using trial_end=now).

        await prisma.notification.create({
          data: {
            userId: user.id,
            message: "Your trial will end soon",
          },
        })
      }
    }

    // invoice.payment_failed
    // notify user
  } catch (err) {
    logger.error({ error: err.message })
    res.status(500)
    res.send(err.message)
  } finally {
    res.end()
  }
}

export default handler
// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}
