import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { navigate } from '../../utils/navigate';
import { getProductDetail } from '../../api/products';
import {
  useLookbookDetail,
  useToggleLike,
  useSaveLookbook,
  useDeleteLookbook,
} from '../../hooks/useLookbookDetail';
import ReportBottomSheet from './components/ReportBottomSheet';

export default function LookbookDetailPage() {
  const { lookbookId } = useParams();
  const id = Number(lookbookId);
  const isValidId = Number.isFinite(id) && !Number.isNaN(id);

  const { data: lookbook, isLoading, isError } = useLookbookDetail(id);
  const toggleLike = useToggleLike(id);
  const saveLookbook = useSaveLookbook(id);
  const deleteLookbookMutation = useDeleteLookbook(id);

  // 매칭 상품이 실제 카탈로그 상품일 때만 상세(이름/가격/판매처)를 조회한다.
  const { data: product } = useQuery({
    queryKey: ['productDetail', lookbook?.matchedProductId],
    queryFn: () => getProductDetail(lookbook!.matchedProductId!),
    enabled: !!lookbook?.matchedProductId,
  });

  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠어요?')) return;
    await deleteLookbookMutation.mutateAsync();
    navigate('/');
  };

  if (!isValidId) {
    return <div className='p-4 text-center'>잘못된 접근이에요</div>;
  }

  if (isLoading) return <div className='p-4 text-center'>불러오는 중...</div>;
  if (isError || !lookbook)
    return <div className='p-4 text-center'>삭제된 콘텐츠입니다</div>;

  const purchaseUrl = product
    ? (product.affiliateUrl ?? product.purchaseUrl)
    : lookbook.purchaseUrl;

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
        {lookbook.matchedImageUrl && (
          <img
            src={lookbook.matchedImageUrl}
            alt='가성비 매칭'
            className='flex-1 rounded-xl'
          />
        )}
      </div>

      <div className='px-4 pt-3 flex items-center gap-2'>
        <div className='w-7 h-7 rounded-full bg-gray-200 overflow-hidden'>
          {lookbook.authorProfileImageUrl && (
            <img
              src={lookbook.authorProfileImageUrl}
              alt=''
              className='h-full w-full object-cover'
            />
          )}
        </div>
        <div>
          <div className='text-xs font-bold'>{lookbook.authorNickname}</div>
          <div className='text-[9px] text-gray-400'>
            {new Date(lookbook.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className='flex gap-1 flex-wrap px-4 pt-2'>
        {lookbook.tags?.slice(0, 5).map((tag) => (
          <span
            key={tag.tagId}
            className='text-xs bg-purple-50 text-purple-800 px-2 py-1 rounded-full'
          >
            #{tag.tagName}
          </span>
        ))}
      </div>

      {lookbook.comment && (
        <p className='px-4 pt-2 text-xs leading-relaxed'>{lookbook.comment}</p>
      )}

      {purchaseUrl && (
        <div className='mx-4 mt-2 bg-gray-50 rounded-xl p-3'>
          <div className='text-xs font-bold mb-2'>🛍️ 구매한 상품</div>
          {product && (
            <div className='flex items-center gap-2 mb-1'>
              <div className='flex-1'>
                <div className='text-xs font-semibold'>{product.name}</div>
                <div className='text-[9px] text-gray-400'>
                  {product.sellerName}
                </div>
              </div>
              <div className='text-sm font-bold text-purple-800'>
                {product.price.amount.toLocaleString()}
                {product.price.currency === 'KRW'
                  ? '원'
                  : ` ${product.price.currency}`}
              </div>
            </div>
          )}
          <button
            className='w-full bg-purple-400 text-white rounded-lg py-2 text-xs font-bold mt-1'
            onClick={() =>
              window.open(purchaseUrl, '_blank', 'noopener,noreferrer')
            }
          >
            구매하러 가기 →
          </button>
        </div>
      )}

      <div className='mt-auto flex items-center justify-between px-4 py-3 border-t'>
        <button
          onClick={() => toggleLike.mutate(lookbook.isLiked)}
          className='flex items-center gap-1.5'
        >
          <span>{lookbook.isLiked ? '❤️' : '🤍'}</span>
          <span className='text-xs font-bold'>{lookbook.likeCount}</span>
        </button>
        <button
          onClick={() => saveLookbook.mutate()}
          aria-label='마이 클로젯에 저장'
        >
          📑
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
            {lookbook.isOwner ? (
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
          isOpen={showReportSheet}
          lookbookId={id}
          onClose={() => setShowReportSheet(false)}
        />
      )}
    </div>
  );
}
