import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getAnalysis } from '../../api/analysis';

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

// 마이 클로젯에서 저장된 분석 리포트를 다시 볼 때 쓰는 읽기 전용 상세 화면.
// 새로 매칭을 돌리는 화면(ResultReportPage)과 달리, 이미 저장을 마친 selectedItems를
// 그대로 보여주기만 한다 — 재선택/재저장 UI는 없음.
export default function ReportDetailPage() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const id = Number(reportId);

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['analysisReportDetail', id],
    queryFn: () => getAnalysis(id),
    enabled: Number.isFinite(id),
  });

  if (isLoading) return <div className="p-4 text-center text-sm text-text-secondary">불러오는 중...</div>;
  if (isError || !report) {
    return <div className="p-4 text-center text-sm text-text-secondary">삭제되었거나 볼 수 없는 리포트입니다</div>;
  }

  const itemsByCategory = report.selectedItems.reduce<Record<string, typeof report.selectedItems>>(
    (acc, item) => {
      (acc[item.category] ??= []).push(item);
      return acc;
    },
    {},
  );

  return (
    <div className="max-w-[375px] min-h-screen min-h-[100dvh] mx-auto bg-bg flex flex-col text-text">
      <div className="flex items-center justify-between px-[20px] py-[12px] sticky top-0 bg-bg z-10 border-b border-border">
        <button type="button" onClick={() => navigate(-1)} className="text-[22px] text-text-secondary p-1" aria-label="뒤로가기">
          ←
        </button>
        <span className="text-[16px] font-bold text-text">분석 리포트</span>
        <span className="w-[30px]" aria-hidden="true" />
      </div>

      <div className="flex-1 overflow-y-auto px-[20px] py-[16px] flex flex-col gap-[16px]">
        <div className="aspect-square rounded-xl bg-bg-secondary overflow-hidden">
          <img src={report.imageUrl} alt="분석한 사진" className="h-full w-full object-cover" />
        </div>

        <div className="flex gap-[6px] flex-wrap">
          {report.tags.map((tag) => (
            <span key={tag} className="text-[11px] bg-primary-50 text-primary-800 px-[10px] py-[4px] rounded-full font-semibold">
              #{tag}
            </span>
          ))}
        </div>

        {report.selectedItems.length === 0 ? (
          <p className="py-10 text-center text-xs text-text-secondary">저장된 상품이 없습니다</p>
        ) : (
          Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category}>
              <div className="text-[12px] font-bold text-text pb-[6px]">
                {CATEGORY_LABELS[category] ?? category}
              </div>
              <div className="flex flex-col gap-[8px]">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-[10px] rounded-[11px] p-[10px] items-center border border-border bg-white"
                  >
                    <div
                      className="w-[52px] h-[52px] rounded-[8px] bg-bg-secondary shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-text font-bold truncate">{item.name ?? '상품 정보 없음'}</div>
                      {item.sellerName && (
                        <div className="text-[10px] text-text-secondary mt-[2px]">{item.sellerName}</div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-[6px] shrink-0">
                      {item.price && (
                        <div className="text-[13px] font-extrabold text-primary-800">
                          {item.price.amount.toLocaleString()}
                          {item.price.currency === 'KRW' ? '원' : ` ${item.price.currency}`}
                        </div>
                      )}
                      {item.purchaseUrl && (
                        <button
                          type="button"
                          onClick={() => window.open(item.purchaseUrl!, '_blank', 'noopener,noreferrer')}
                          className="text-[10px] font-bold text-primary-600 underline"
                        >
                          구매하러 가기 →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
