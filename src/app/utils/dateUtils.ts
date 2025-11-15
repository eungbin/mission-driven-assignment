/**
 * 날짜 formatting 유틸리티
 */

/**
 * YYYY-MM-DD 형식을 YYYY년 MM월 DD일 형식으로 변환
 */
export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환
 */
export function formatDateForStorage(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD 형식 문자열을 Date 객체로 변환
 */
export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * 두 날짜가 같은 날인지 확인
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 날짜가 오늘 이후인지 확인 (오늘 포함)
 */
export function isTodayOrAfter(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

export interface DateRange {
  minDate: Date;
  maxDate: Date | null;
}
/**
 * 회차별 선택 가능한 날짜 범위 계산
 * @param sessionId 세션 ID
 * @param sessions 세션 배열
 * @returns 선택 가능한 날짜 범위
 */
export function getAvailableDateRange(
  sessionId: string,
  sessions: Array<{ id: string; date: string }>
): DateRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentIndex = sessions.findIndex((s) => s.id === sessionId);
  const previousSessions = sessions.slice(0, currentIndex);
  const nextSessions = sessions.slice(currentIndex + 1);

  // 최소 날짜: 오늘 또는 이전 회차의 최대 날짜 + 1일
  const previousMaxDates = previousSessions
    .filter((s) => s.date)
    .map((s) => {
      const date = parseDate(s.date);
      return date.getTime();
    });

  const previousMaxTime =
    previousMaxDates.length > 0 ? Math.max(...previousMaxDates) : 0;
  const previousMaxDate = previousMaxTime > 0 ? new Date(previousMaxTime) : null;

  const minDate = previousMaxDate
    ? new Date(previousMaxDate.getTime() + 86400000) // +1일
    : today;

  // 오늘보다 이전이면 오늘을 최소 날짜로 설정
  if (minDate < today) {
    minDate.setTime(today.getTime());
  }

  // 최대 날짜: 이후 회차의 최소 날짜 - 1일
  const nextMinDates = nextSessions
    .filter((s) => s.date)
    .map((s) => {
      const date = parseDate(s.date);
      return date.getTime();
    });

  const nextMinTime =
    nextMinDates.length > 0 ? Math.min(...nextMinDates) : null;
  const maxDate = nextMinTime
    ? new Date(nextMinTime - 86400000) // -1일
    : null;

  return { minDate, maxDate };
}

/**
 * 날짜가 선택 가능한 범위 내에 있는지 확인
 */
export function isDateSelectable(
  date: Date,
  range: DateRange
): boolean {
  if (date < range.minDate) return false;
  if (range.maxDate && date > range.maxDate) return false;
  return true;
}

