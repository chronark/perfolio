import { DataSource } from "apollo-datasource"
import {
  CreateTransaction,
  Transaction,
  CreateUserSettings,
  UpdateUserSettings,
} from "@perfolio/api/graphql"

import { db, Transaction as TransactionModel } from "@perfolio/integrations/fauna"
export class Fauna extends DataSource {
  constructor() {
    super()
  }
  public async createTransaction(tx: CreateTransaction): Promise<Transaction> {
    const createdTransaction = await db().transaction.create(tx)

    return {
      ...createdTransaction.data,
      id: createdTransaction.id,
    }
  }
  public async createUserSettings(settings: CreateUserSettings) {
    const createdUserSettings = await db().settings.create(settings.userId, settings)

    return createdUserSettings.data
  }
  public async updateUserSettings(settings: UpdateUserSettings) {
    const updatedUserSettings = await db().settings.update(settings.userId, {
      defaultCurrency: settings.defaultCurrency ?? undefined,
      defaultExchange: settings.defaultExchange ?? undefined,
    })
    return updatedUserSettings.data
  }

  public async getUserSettings(userId: string) {
    return await db().settings.fromUserId(userId)
  }

  public async getTransaction(transactionId: string) {
    return await db().transaction.fromId(transactionId)
  }
  public async getTransactions(userId: string) {
    return await db().transaction.fromUser(userId)
  }
  public async deleteTransaction(transaction: TransactionModel) {
    await db().transaction.delete(transaction)
  }
}
