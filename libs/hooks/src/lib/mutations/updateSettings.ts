import { useMutation, useQueryClient } from "react-query"
import { UpdateSettingsMutation, UpdateSettings } from "@perfolio/api/graphql"
import { client } from "../client"
import { USE_USER_QUERY_KEY } from "../queries/useUser"
import { useAccessToken } from "@perfolio/auth"

export const useUpdateSettings = () => {
  const { getAccessToken, getClaims } = useAccessToken()
  const queryClient = useQueryClient()
  const { data, ...meta } = useMutation<
    UpdateSettingsMutation,
    Error,
    { settings: Omit<UpdateSettings, "userId"> }
  >(
    async (variables) => {
      const accessToken = await getAccessToken()
      const claims = await getClaims(accessToken)
      return client(accessToken).updateSettings({
        settings: { ...variables.settings, userId: claims.sub },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(USE_USER_QUERY_KEY)
      },
    },
  )

  return { settings: data?.updateSettings, ...meta }
}
