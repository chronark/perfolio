import { useQuery } from "react-query"
import { Mean } from "@perfolio/feature/finance/kpis"
import { ValueAtTime } from "@perfolio/api/graphql"

export const USE_ABSOLUTE_MEAN = "USE_ABSOLUTE_MEAN"

export const useAbsoluteMean = (absolutePortfolioHistory: ValueAtTime[]) => {
  const { data, ...meta } = useQuery([USE_ABSOLUTE_MEAN, { absolutePortfolioHistory }], () =>
    Mean.getAbsolute(absolutePortfolioHistory.map(({ value }) => value)),
  )

  return { absoluteMean: data ?? 0, ...meta }
}