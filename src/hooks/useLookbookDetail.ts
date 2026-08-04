import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getLookbookDetail,
  likeLookbook,
  unlikeLookbook,
  saveLookbook,
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
    enabled: Number.isFinite(lookbookId),
  });

export const useToggleLike = (lookbookId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    // isLiked는 실제 API가 좋아요/좋아요 취소를 서로 다른 엔드포인트(POST/DELETE)로
    // 나눠놓았기 때문에, 호출 시점의 현재 상태를 보고 어느 쪽을 부를지 결정한다.
    mutationFn: (currentlyLiked: boolean) =>
      currentlyLiked ? unlikeLookbook(lookbookId) : likeLookbook(lookbookId),
    onMutate: async (currentlyLiked) => {
      await queryClient.cancelQueries({ queryKey: detailKey(lookbookId) });
      const previous = queryClient.getQueryData<LookbookDetail>(
        detailKey(lookbookId),
      );
      queryClient.setQueryData<LookbookDetail>(detailKey(lookbookId), (old) =>
        old
          ? {
              ...old,
              isLiked: !currentlyLiked,
              likeCount: currentlyLiked ? old.likeCount - 1 : old.likeCount + 1,
            }
          : old,
      );
      return { previous };
    },
    onSuccess: (result) => {
      queryClient.setQueryData<LookbookDetail>(detailKey(lookbookId), (old) =>
        old
          ? { ...old, isLiked: result.isLiked, likeCount: result.likeCount }
          : old,
      );
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(detailKey(lookbookId), context.previous);
    },
  });
};

// 저장 취소는 saveId가 없어 아직 연동 불가 — api/lookbooks.ts의 saveLookbook 주석 참고
export const useSaveLookbook = (lookbookId: number) =>
  useMutation({
    mutationFn: () => saveLookbook(lookbookId),
    onSuccess: () => {
      alert('마이 클로젯에 저장했어요');
    },
  });

export const useReportLookbook = (lookbookId: number) =>
  useMutation({
    mutationFn: (reason: ReportType) => reportLookbook(lookbookId, reason),
  });

export const useDeleteLookbook = (lookbookId: number) =>
  useMutation({
    mutationFn: () => deleteLookbook(lookbookId),
  });
