import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSaveReport } from '../hooks/useSaveReport';
import { useUploadStore } from '../store/useUploadStore';
import type { RecommendationItem } from '../api/analysis';
import type { LookbookUploadNavState } from './LookbookUpload/LookbookUploadPage';
import { REASON_CODE_MAP } from '../constants/tag';

const CATEGORY_LABELS: Record<string, string> = {
  OUTER: '아우터',
  TOP: '상의',
  BOTTOM: '하의',
  DRESS: '원피스',
  SHOES: '신발',
  BAG: '가방',
  ACCESSORY: '액세서리',
  OTHER: '기타',
};

export const ResultReportPage: React.FC = () => {
  const navigate = useNavigate();
  const reportId = useUploadStore((state) => state.reportId);
  const imageId = useUploadStore((state) => state.imageId);
  const imageUri = useUploadStore((state) => state.imageUri);
  const tags = useUploadStore((state) => state.aiTags);
  const suggestedTags = useUploadStore((state) => state.suggestedTags);
  const recommendationGroups = useUploadStore((state) => state.recommendationGroups);
  const partial = useUploadStore((state) => state.partial);
  const warnings = useUploadStore((state) => state.warnings);

  const { mutate: submitSaveReport, isPending } = useSaveReport();

  // 카테고리별로 선택된 상품 productId
  const [selectedByCategory, setSelectedByCategory] = useState<Record<string, number>>({});

  const nonEmptyGroups = useMemo(
    () => recommendationGroups.filter((group) => group.items.length > 0),
    [recommendationGroups],
  );

  const allSelected =
    nonEmptyGroups.length > 0 &&
    nonEmptyGroups.every((group) => selectedByCategory[group.category] !== undefined);

  const handleSave = () => {
    if (!reportId) return;
    if (!allSelected) {
      alert('저장하려면 상품이 있는 카테고리마다 하나씩 선택해주세요.');
      return;
    }
    submitSaveReport({
      reportId,
      selectedItems: Object.entries(selectedByCategory).map(([category, productId]) => ({
        category,
        productId,
      })),
    });
  };

  const handleSelect = (category: string, productId: number) => {
    setSelectedByCategory((prev) => ({ ...prev, [category]: productId }));
  };

  // 룩북은 "매칭 상품" 하나만 지원(백엔드 LookbookRequest.matchedProductId가 단일 값) —
  // 여러 카테고리를 선택했다면 첫 번째 선택을 대표 상품으로 사용한다.
  const handleUploadAsLookbook = () => {
    if (!reportId || !imageId || !allSelected) return;
    const firstSelectedProductId = Object.values(selectedByCategory)[0];
    const matchedItem = nonEmptyGroups
      .flatMap((group) => group.items)
      .find((item) => item.productId === firstSelectedProductId);
    if (!matchedItem) return;

    const suggestedByName = new Map(suggestedTags.map((tag) => [tag.tagName, tag]));
    const confirmedTags = tags
      .map((tagName) => suggestedByName.get(tagName))
      .filter((tag): tag is (typeof suggestedTags)[number] => tag !== undefined);

    const navState: LookbookUploadNavState = {
      originalImageId: imageId,
      originalImageUrl: imageUri,
      sourceReportId: reportId,
      matchedProduct: {
        productId: matchedItem.productId,
        imageUrl: matchedItem.imageUrl,
        name: matchedItem.name,
        purchaseUrl: matchedItem.purchaseUrl,
      },
      tags: confirmedTags,
    };
    navigate('/upload', { state: navState });
  };

  const ItemCard = ({
    item,
    category,
    isSelected,
  }: {
    item: RecommendationItem;
    category: string;
    isSelected: boolean;
  }) => (
    <div
      className={`flex gap-[10px] rounded-[11px] p-[10px] items-center transition-colors border-[1px] ${
        isSelected ? 'border-primary-400 bg-primary-50' : 'border-border bg-white'
      }`}
    >
      {/* Radio Button — 룩북 조합용 선택 */}
      <button
        type="button"
        onClick={() => handleSelect(category, item.productId)}
        aria-label="이 상품 선택"
        className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
          isSelected ? 'border-primary-400 bg-primary-400' : 'border-border bg-bg-secondary'
        }`}
      >
        {isSelected && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* 이미지/이름 — 상품 상세로 이동 */}
      <button
        type="button"
        onClick={() => navigate(`/product/${item.productId}`)}
        className="flex flex-1 min-w-0 gap-[10px] items-center text-left"
      >
        <div
          className="w-[44px] h-[44px] rounded-[8px] bg-bg-secondary shrink-0 bg-cover bg-center"
          style={{ backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined }}
        ></div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="text-[12px] text-text font-bold truncate">{item.name}</div>
          <div className="text-[10px] text-text-secondary mt-[2px]">{item.sellerName}</div>
          {item.reasonCode && REASON_CODE_MAP[item.reasonCode] && (
            <div className="mt-[6px]">
              <span className={`px-[6px] py-[3px] text-[10px] leading-none rounded-full ${REASON_CODE_MAP[item.reasonCode].color}`}>
                {REASON_CODE_MAP[item.reasonCode].label}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end">
          <div className="text-[10px] px-[6px] py-[2px] rounded-[6px] font-extrabold bg-[#FAEEDA] text-[#633806] mb-[4px]">
            {item.rank}위 매칭
          </div>
          <div className="text-[14px] font-extrabold text-primary-800">
            {item.price.amount.toLocaleString()}{item.price.currency === 'KRW' ? '원' : ` ${item.price.currency}`}
          </div>
        </div>
      </button>
    </div>
  );

  return (
    <div className="max-w-[375px] min-h-screen mx-auto bg-bg flex flex-col text-text relative">
      {/* Header */}
      <div className="flex items-center justify-between p-[12px_20px_8px] shrink-0 bg-bg z-10 sticky top-0">
        <span onClick={() => navigate(-1)} className="text-[22px] text-text-secondary cursor-pointer p-1">←</span>
        <div className="flex flex-col items-center">
          <span className="text-[16px] font-bold text-text">분석 결과</span>
        </div>
        <span
          onClick={handleSave}
          className={`text-[14px] font-bold text-primary-400 cursor-pointer p-1 ${isPending ? 'opacity-50 pointer-events-none' : !allSelected ? 'opacity-50' : ''}`}
        >
          {isPending ? '저장 중...' : '저장'}
        </span>
      </div>

      {/* Tags */}
      <div className="flex gap-[6px] px-[20px] pt-[4px] pb-[12px] flex-wrap shrink-0 border-b border-border bg-bg">
        {tags.map((tag) => (
          <div key={tag} className="inline-flex items-center gap-[5px] text-[11px] bg-primary-50 text-primary-800 px-[10px] py-[4px] rounded-full font-semibold">
            #{tag}
          </div>
        ))}
      </div>

      {partial && warnings.length > 0 && (
        <div className="mx-[20px] mt-[10px] rounded-[10px] bg-[#FFF6E5] border border-[#F3D9A0] px-[12px] py-[8px] text-[11px] text-[#7A5B00]">
          {warnings.join(' ')}
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-[20px] flex flex-col gap-[12px] pb-[100px] pt-[14px]">
        {nonEmptyGroups.length === 0 && (
          <p className="py-10 text-center text-xs text-text-secondary">추천 결과가 없습니다</p>
        )}

        {nonEmptyGroups.map((group) => (
          <div key={group.category}>
            <div className="text-[12px] font-bold text-text pb-[4px] flex items-center gap-[6px]">
              {CATEGORY_LABELS[group.category] ?? group.category}{' '}
              <span className="text-[10px] bg-bg-secondary text-text-secondary px-[6px] py-[2px] rounded-[6px] font-semibold">
                {group.items.length}개 대안
              </span>
            </div>
            <div className="flex flex-col gap-[8px] mb-[10px]">
              {group.items.map((item) => (
                <ItemCard
                  key={item.productId}
                  item={item}
                  category={group.category}
                  isSelected={selectedByCategory[group.category] === item.productId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-[20px] left-[20px] right-[20px] z-20">
        <button
          onClick={handleUploadAsLookbook}
          disabled={!allSelected}
          className="w-full text-bg text-[15px] font-bold border-none rounded-[14px] p-[16px] bg-primary-400 hover:bg-primary-500 transition-colors shadow-[0_5px_12px_rgba(127,119,221,0.3)] disabled:bg-border disabled:text-text-secondary disabled:shadow-none"
        >
          이 조합으로 내 룩북 올리기
        </button>
      </div>
    </div>
  );
};
