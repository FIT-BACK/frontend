import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteClosetItem, getClosetItems, saveTrendToCloset } from '../api/closet'

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

export const useSaveTrend = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveTrendToCloset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['closetItems'] })
      alert('마이 클로젯에 저장했어요')
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || '저장에 실패했습니다. 다시 시도해주세요.')
    },
  })
}
