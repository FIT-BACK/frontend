import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteClosetItem, getClosetItems } from '../api/closet'

export const useClosetItems = () =>
  useQuery({
    queryKey: ['closetItems'],
    queryFn: getClosetItems,
  })

export const useDeleteClosetItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteClosetItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['closetItems'] }),
  })
}
