/**
 * ==========================================
 *  트렌드 아티클 콘텐츠 (SCR-18/19)
 * ==========================================
 *
 * 트렌드 아티클은 별도 업로드 화면 없이, 이 파일을 레포에 push할 권한이 있는
 * 사람(=사실상 관리자)만 수정해서 올리는 방식으로 관리한다.
 * 사진(photo) / 외부 기사(article) / 유튜브 영상(youtube) 세 가지 타입을 지원한다.
 */

export type TrendContentType = 'photo' | 'article' | 'youtube';

interface TrendArticleBase {
  id: number;
  tag: string;
  title: string;
  tagColor: string;
  bgGradient: string;
  description: string;
  relatedTags: string[];
}

export interface PhotoTrendArticle extends TrendArticleBase {
  contentType: 'photo';
  imageUrl: string;
}

export interface ArticleTrendArticle extends TrendArticleBase {
  contentType: 'article';
  sourceName: string;
  sourceUrl: string;
}

export interface YoutubeTrendArticle extends TrendArticleBase {
  contentType: 'youtube';
  youtubeVideoId: string;
}

export type TrendArticle = PhotoTrendArticle | ArticleTrendArticle | YoutubeTrendArticle;

export const TREND_ARTICLES: TrendArticle[] = [
  {
    id: 1,
    tag: '#미니멀',
    title: '미니멀 무드',
    tagColor: '#3c3489',
    bgGradient: 'linear-gradient(160deg, #EEE9FF, #D5CCF5)',
    description:
      '군더더기 없는 깔끔한 실루엣과 뉴트럴 컬러로 완성하는 미니멀 스타일. 이번 시즌 가장 핫한 트렌드예요.',
    relatedTags: ['#미니멀', '#뉴트럴', '#와이드핏'],
    contentType: 'photo',
    imageUrl: 'https://picsum.photos/seed/trend-minimal/600/400',
  },
  {
    id: 2,
    tag: '#스트릿',
    title: '스트릿 무드',
    tagColor: '#3c3489',
    bgGradient: 'linear-gradient(160deg, #F0EDF9, #DDD5F5)',
    description: '오버사이즈 실루엣과 레이어드 룩으로 완성하는 스트릿 스타일링.',
    relatedTags: ['#스트릿', '#오버사이즈', '#캐주얼'],
    contentType: 'youtube',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
  {
    id: 3,
    tag: '#빈티지',
    title: '빈티지 무드',
    tagColor: '#27500A',
    bgGradient: 'linear-gradient(160deg, #EDF5E8, #C8E4C0)',
    description: '올해 다시 돌아온 Y2K·빈티지 무드를 정리한 에디터 기사.',
    relatedTags: ['#빈티지', '#Y2K'],
    contentType: 'article',
    sourceName: '보그 코리아',
    sourceUrl: 'https://www.vogue.co.kr/',
  },
  {
    id: 4,
    tag: '#캐주얼',
    title: '캐주얼 무드',
    tagColor: '#9C620B',
    bgGradient: 'linear-gradient(160deg, #FEF5E8, #FAD9A0)',
    description: '데일리로 편하게 입기 좋은 캐주얼 코디 모음.',
    relatedTags: ['#캐주얼', '#데일리룩'],
    contentType: 'photo',
    imageUrl: 'https://picsum.photos/seed/trend-casual/600/400',
  },
  {
    id: 5,
    tag: '#포멀',
    title: '오피스 포멀 무드',
    tagColor: '#3c3489',
    bgGradient: 'linear-gradient(160deg, #EAF0FA, #C9D9F0)',
    description: '단정하면서도 트렌디한 오피스룩 세팅 가이드 영상.',
    relatedTags: ['#포멀', '#오피스룩'],
    contentType: 'youtube',
    youtubeVideoId: 'dQw4w9WgXcQ',
  },
];
