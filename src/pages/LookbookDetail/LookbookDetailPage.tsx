import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { navigate } from '../../utils/navigate';
import {
  useLookbookDetail,
  useToggleLike,
  useToggleSave,
  useDeleteLookbook,
} from '../../hooks/useLookbookDetail';
import ReportBottomSheet from './components/ReportBottomSheet';

export default function LookbookDetailPage() {
  const { lookbookId } = useParams();
  const id = Number(lookbookId);

  const { data: lookbook, isLoading, isError } = useLookbookDetail(id);
  const toggleLike = useToggleLike(id);
  const toggleSave = useToggleSave(id);
  const deleteLookbookMutation = useDeleteLookbook(id);

  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠어요?')) return;
    await deleteLookbookMutation.mutateAsync();
    navigate('/');
  };

  if (isLoading) return <div className='p-4 text-center'>불러오는 중...</div>;
  if (isError || !lookbook)
    return <div className='p-4 text-center'>삭제된 콘텐츠입니다</div>;

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between px-4 py-2'>
        <button onClick={() => navigate(-1 as unknown as string)}>←</button>
        <span className='font-bold text-sm'>룩북</span>
        <button onClick={() => setShowMoreSheet(true)}>⋮</button>
      </div>

      <div className='flex gap-1.5 px-4'>
        <img
          src={lookbook.originalImageUrl}
          alt='원본 룩'
          className='flex-1 rounded-xl'
        />
        <img
          src={lookbook.matchedImageUrl}
          alt='가성비 매칭'
          className='flex-1 rounded-xl'
        />
      </div>

      <div className='px-4 pt-3 flex items-center gap-2'>
        <div className='w-7 h-7 rounded-full bg-gray-200' />
        <div>
          <div className='text-xs font-bold'>{lookbook.authorNickname}</div>
          <div className='text-[9px] text-gray-400'>{lookbook.createdAt}</div>
        </div>
      </div>

      <div className='flex gap-1 flex-wrap px-4 pt-2'>
        {lookbook.styleTags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className='text-xs bg-purple-50 text-purple-800 px-2 py-1 rounded-full'
          >
            #{tag}
          </span>
        ))}
      </div>

      {lookbook.comment && (
        <p className='px-4 pt-2 text-xs leading-relaxed'>{lookbook.comment}</p>
      )}

      {lookbook.products.length > 0 && (
        <div className='mx-4 mt-2 bg-gray-50 rounded-xl p-3'>
          <div className='text-xs font-bold mb-2'>🛍️ 구매한 상품</div>
          {lookbook.products.map((p) => (
            <div key={p.id} className='flex items-center gap-2 mb-1'>
              <div className='flex-1'>
                <div className='text-xs font-semibold'>{p.name}</div>
                <div className='text-[9px] text-gray-400'>{p.shopName}</div>
              </div>
              <div className='text-sm font-bold text-purple-800'>
                ₩{p.price.toLocaleString()}
              </div>
            </div>
          ))}
          {lookbook.products[0].purchaseUrl && (
            <button
              className='w-full bg-purple-400 text-white rounded-lg py-2 text-xs font-bold mt-1'
              onClick={() =>
                window.open(lookbook.products[0].purchaseUrl!, '_blank')
              }
            >
              구매하러 가기 →
            </button>
          )}
        </div>
      )}

      {lookbook.relatedTrend && (
        <button
          className='flex items-center gap-1.5 px-4 py-2 text-xs text-teal-700'
          onClick={() => navigate(`/trends/${lookbook.relatedTrend!.id}`)}
        >
          관련 트렌드: {lookbook.relatedTrend.name} →
        </button>
      )}

      <div className='mt-auto flex items-center justify-between px-4 py-3 border-t'>
        <button
          onClick={() => toggleLike.mutate()}
          className='flex items-center gap-1.5'
        >
          <span>{lookbook.isLiked ? '❤️' : '🤍'}</span>
          <span className='text-xs font-bold'>{lookbook.likeCount}</span>
        </button>
        <button onClick={() => toggleSave.mutate()}>
          {lookbook.isSaved ? '🔖' : '📑'}
        </button>
      </div>

      {showMoreSheet && (
        <div
          className='fixed inset-0 bg-black/30 flex items-end'
          onClick={() => setShowMoreSheet(false)}
        >
          <div
            className='w-full bg-white rounded-t-2xl p-4'
            onClick={(e) => e.stopPropagation()}
          >
            {lookbook.isMine ? (
              <>
                <button
                  className='w-full text-left py-3'
                  onClick={() => navigate(`/lookbooks/${id}/edit`)}
                >
                  수정하기
                </button>
                <button
                  className='w-full text-left py-3 text-pink-600'
                  onClick={handleDelete}
                >
                  삭제하기
                </button>
              </>
            ) : (
              <button
                className='w-full text-left py-3'
                onClick={() => {
                  setShowMoreSheet(false);
                  setShowReportSheet(true);
                }}
              >
                신고하기
              </button>
            )}
          </div>
        </div>
      )}

      {showReportSheet && (
        <ReportBottomSheet
          lookbookId={id}
          onClose={() => setShowReportSheet(false)}
        />
      )}
    </div>
  );
}
