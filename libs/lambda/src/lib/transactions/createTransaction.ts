import { MiddlewareContext } from "@perfolio/middleware"
import { z } from "zod"
import { db, Transaction } from "@perfolio/db"

export const CreateTransactionRequestValidation = Transaction.schema.omit({
  userId: true,
})

export type CreateTransactionRequest = z.infer<typeof CreateTransactionRequestValidation>
export type CreateTransactionResponse = Transaction
export async function createTransaction(
  { value, assetId, executedAt, volume }: CreateTransactionRequest,
  { claims }: MiddlewareContext,
): Promise<CreateTransactionResponse> {
  return await db().transaction.create({
    userId: claims.userId,
    value,
    assetId,
    executedAt,
    volume,
  })
}