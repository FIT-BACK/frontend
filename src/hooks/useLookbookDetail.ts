import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getLookbookDetail,
  toggleLookbookLike,
  toggleLookbookSave,
  reportLookbook,
  deleteLookbook,
  type LookbookDetail,
  type ReportType,
} from '../api/lookbooks';

const detailKey = (id: number) => ['lookbookDetail', id];

export const useLookbookDetail = (lookbookId: number) =>
  useQuery({
    queryKey: detailKey(lookbookId),
    queryFn: () => getLookbookDetail(lookbookId),
  });

export const useToggleLike = (lookbookId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleLookbookLike(lookbookId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey(lookbookId) });
      const previous = queryClient.getQueryData<LookbookDetail>(
        detailKey(lookbookId),
      );
      queryClient.setQueryData<LookbookDetail>(detailKey(lookbookId), (old) =>
        old
          ? {
              ...old,
              isLiked: !old.isLiked,
              likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
            }
          : old,
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(detailKey(lookbookId), context.previous);
    },
  });
};

export const useToggleSave = (lookbookId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleLookbookSave(lookbookId),
    onSuccess: () => {
      queryClient.setQueryData<LookbookDetail>(detailKey(lookbookId), (old) =>
        old ? { ...old, isSaved: !old.isSaved } : old,
      );
    },
  });
};

export const useReportLookbook = (lookbookId: number) =>
  useMutation({
    mutationFn: (reportType: ReportType) =>
      reportLookbook(lookbookId, reportType),
  });

export const useDeleteLookbook = (lookbookId: number) =>
  useMutation({
    mutationFn: () => deleteLookbook(lookbookId),
  });
