import {
  useGetTransactionsQuery,
  Transaction,
  useGetCompanyFromIsinQuery,
} from "@perfolio/api/graphql"
import { Time } from "@perfolio/util/time"
import React from "react"
import { Loading, Text } from "@perfolio/ui/components"
import cn from "classnames"
import { useUser } from "@clerk/clerk-react"
interface TransactionActivityItemProps {
  transaction: Omit<Transaction, "userId">
  isFirst?: boolean
}

const TransactionActivityItem: React.FC<TransactionActivityItemProps> = ({
  transaction,
  isFirst,
}): JSX.Element => {
  const { data, loading } = useGetCompanyFromIsinQuery({
    variables: { isin: transaction.asset.id },
  })
  const company = data?.getCompanyFromIsin
  return (
    <li
      className={cn(" py-4", {
        "border-t border-gray-100": !isFirst,
      })}
    >
      {loading || !company ? (
        <Loading />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Text size="sm" bold>
              New Transaction
            </Text>
            <Text size="xs">{Time.ago(transaction.executedAt)}</Text>
          </div>
          <Text size="sm">
            You {transaction.volume > 0 ? "bought" : "sold"} {transaction.volume}{" "}
            <span className="font-semibold">{company.ticker}</span> shares at ${transaction.value}{" "}
            per share.
          </Text>
        </>
      )}
    </li>
  )
}

export const ActivityFeed: React.FC = (): JSX.Element => {
  const user = useUser()
  const { data } = useGetTransactionsQuery({ variables: { userId: user.id } })
  const transactions = data?.getTransactions
  const last5Transactions = transactions
    ? [...transactions].sort((a, b) => b.executedAt - a.executedAt).slice(0, 5)
    : []

  return (
    <>
      <p className="text-base font-semibold text-gray-800">Recent Activity</p>
      <ul>
        {last5Transactions?.map((tx, i) => (
          <TransactionActivityItem key={tx.id} transaction={tx as Transaction} isFirst={i === 0} />
        ))}
      </ul>
    </>
  )
}
