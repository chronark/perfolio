import { useMutation, useQueryClient } from "react-query"
import { UpdateSettingsMutation, UpdateSettings } from "@perfolio/pkg/api/graphql"
import { client } from "../client"
import { USE_USER_QUERY_KEY } from "../queries/useUser"
import { useAuth0 } from "@auth0/auth0-react"

export const useUpdateSettings = () => {
  const { getAccessTokenSilently, user } = useAuth0()
  const queryClient = useQueryClient()
  const { data, ...meta } = useMutation<
    UpdateSettingsMutation,
    Error,
    { settings: Omit<UpdateSettings, "userId"> }
  >(
    async (variables) => {
      const accessToken = await getAccessTokenSilently()

      return client(accessToken).updateSettings({
        settings: { ...variables.settings, userId: user!.sub! },
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