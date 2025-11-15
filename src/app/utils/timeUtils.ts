// 시간 관련 유틸리티 함수

interface Time {
  hour: string;
  minute: string;
  period: "오전" | "오후";
}

/**
 * 24시간제 시간(분 단위)으로 변환
 * @param hour 시간
 * @param minute 분
 * @param period 오전/오후
 * @returns 24시간제 시간(분 단위)으로 변환한 값
 */
export function convertTo24Hour(
  hour: string,
  minute: string,
  period: "오전" | "오후"
): number {
  let hour24 = parseInt(hour, 10);
  
  if (period === "오후" && hour24 !== 12) {
    hour24 += 12;
  } else if (period === "오전" && hour24 === 12) {
    hour24 = 0;
  }
  
  return hour24 * 60 + parseInt(minute, 10); // 분 단위로 변환하여 반환
}

/**
 * 두 시간을 비교 (시작 <= 종료 검증)
 * @param startTime 시작 시간
 * @param endTime 종료 시간
 * @returns 종료시간이 시작시간보다 크거나 같을 경우 true
 */
export function compareTimes(startTime: Time, endTime: Time): boolean {
  const startMinutes = convertTo24Hour(
    startTime.hour,
    startTime.minute,
    startTime.period
  );
  const endMinutes = convertTo24Hour(
    endTime.hour,
    endTime.minute,
    endTime.period
  );
  
  return startMinutes <= endMinutes;
}

/**
 * 분 단위를 12시간제로 변환
 * @param totalMinutes 0부터 1439까지의 분 단위 시간 (00:00 = 0, 23:59 = 1439)
 * @returns 12시간제 시간 객체
 */
export function convertFromMinutes(totalMinutes: number): Time {
  // 24시간 범위로 제한
  const minutes = Math.max(0, Math.min(1439, totalMinutes));
  
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  
  let hour12: number;
  let period: "오전" | "오후";
  
  if (hour24 === 0) {
    // 자정 (00:00) → 오전 12시
    hour12 = 12;
    period = "오전";
  } else if (hour24 < 12) {
    // 01:00 ~ 11:59 → 오전 1시 ~ 오전 11시
    hour12 = hour24;
    period = "오전";
  } else if (hour24 === 12) {
    // 정오 (12:00) → 오후 12시
    hour12 = 12;
    period = "오후";
  } else {
    // 13:00 ~ 23:59 → 오후 1시 ~ 오후 11시
    hour12 = hour24 - 12;
    period = "오후";
  }
  
  return {
    hour: String(hour12).padStart(2, "0"),
    minute: String(minute).padStart(2, "0"),
    period,
  };
}

/**
 * 시간에 1시간 추가
 * @param hour 시간
 * @param minute 분
 * @param period 오전/오후
 * @returns 1시간 추가한 시간(시간, 분, 오전/오후)
 */
export function addOneHour(
  hour: string,
  minute: string,
  period: "오전" | "오후"
): Time {
  // 현재 시간을 분 단위로 변환
  const currentMinutes = convertTo24Hour(hour, minute, period);
  
  // 1시간(60분) 추가
  const newMinutes = currentMinutes + 60;
  
  // 12시간제로 변환
  return convertFromMinutes(newMinutes);
}

/**
 * 시작 시간으로부터 종료 시간 계산
 * - 시작 시간이 오후 11시 이상이면 → 오후 11:59
 * - 그 외의 경우 → 시작 시간 + 1시간
 */
export function getEndTimeFromStartTime(startTime: Time): Time {
  // 시작 시간을 분 단위로 변환하여 계산
  const startMinutes = convertTo24Hour(
    startTime.hour,
    startTime.minute,
    startTime.period
  );
  
  // 오후 11시 이상인지 확인 (23:00 = 1380분 이상)
  if (startMinutes >= 1380) {
    // 오후 11:59로 고정 (23:59 = 1439분)
    return convertFromMinutes(1439);
  }
  
  // 일반적인 경우: 시작 시간 + 1시간 (60분) 후 종료 시간 반환
  const endMinutes = startMinutes + 60;
  return convertFromMinutes(endMinutes);
}

