"use client";

import { useState, useEffect, useRef } from "react";
import { useDatePickerStore } from "../../store/datePickerStore";
import { useFormStore } from "../../store/formStore";
import {
  formatDateForStorage,
  parseDate,
  isSameDay,
  getAvailableDateRange,
  isDateSelectable,
} from "../../utils/dateUtils";
import Button from "./Button";
import Image from "next/image";

interface DatePickerProps {
  sessionId: string;
}

export default function DatePicker({ sessionId }: DatePickerProps) {
  const { isOpen, currentSessionId, tempSelectedDate, setTempDate, closePicker, confirmDate } =
    useDatePickerStore();
  const { sessions, updateSession } = useFormStore();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 현재 session 정보 가져오기
  const currentSession = sessions.find((s) => s.id === sessionId);

  // 날짜 범위 계산
  const dateRange = getAvailableDateRange(sessionId, sessions);

  // 오늘 날짜
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 이 picker가 열려있는지 확인
  const isThisPickerOpen = isOpen && currentSessionId === sessionId;

  // picker가 열릴 때 초기화
  useEffect(() => {
    if (isThisPickerOpen) {
      // 날짜 범위 계산
      const range = getAvailableDateRange(sessionId, sessions);
      
      // 현재 선택된 날짜가 있으면 해당 달로 이동
      if (currentSession?.date) {
        const selectedDate = parseDate(currentSession.date);
        setCurrentMonth(selectedDate.getMonth());
        setCurrentYear(selectedDate.getFullYear());
        setTempDate(currentSession.date);
      } else {
        // 선택 가능한 날짜 중 가장 이른 날짜 선택 (minDate)
        const defaultDate = range.minDate;
        setCurrentMonth(defaultDate.getMonth());
        setCurrentYear(defaultDate.getFullYear());
        setTempDate(formatDateForStorage(defaultDate));
      }
    }
  }, [isThisPickerOpen, sessionId, currentSession?.date, sessions, setTempDate]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!isThisPickerOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // picker 내부 클릭은 무시
      if (pickerRef.current && pickerRef.current.contains(target)) {
        return;
      }

      // input 필드 클릭은 무시 (input의 onClick에서 처리)
      const clickedInput = target.closest('[data-session-id]') as HTMLElement;
      if (clickedInput) {
        return;
      }

      // 다른 곳 클릭 시 닫기
      closePicker();
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isThisPickerOpen, sessionId, closePicker]);

  /**
   * 달력 데이터 생성
   * @returns 달력 데이터
   */
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // 주의 첫 번째 날 (일요일)

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      isSelectable: boolean;
    }> = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isSelectable = isDateSelectable(date, dateRange);

      days.push({
        date,
        isCurrentMonth,
        isSelectable,
      });
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  // 월 이동 (이전)
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 월 이동 (다음)
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /**
   * 이전 버튼 비활성화 여부 (오늘이 포함된 달이면 비활성화)
   * @returns 이전 버튼 비활성화 여부
   */
  const isPrevDisabled = () => {
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);
    return today >= currentMonthStart && today <= currentMonthEnd;
  };

  // 날짜 선택
  const handleDateClick = (date: Date) => {
    if (!isDateSelectable(date, dateRange)) return;
    const dateStr = formatDateForStorage(date);
    setTempDate(dateStr);
  };

  // 선택 완료
  const handleConfirm = () => {
    if (tempSelectedDate) {
      updateSession(sessionId, { date: tempSelectedDate });
    }
    confirmDate();
  };

  if (!isThisPickerOpen) return null;

  const selectedDate = tempSelectedDate ? parseDate(tempSelectedDate) : null;
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={pickerRef}
        className="absolute top-2 left-0 z-50 bg-white rounded-lg shadow-lg w-full md:w-80"
        style={{
          maxWidth: "400px",
        }}
      >
        {/* 달력 헤더 */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-base">
              {currentYear}년 {monthNames[currentMonth]}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                disabled={isPrevDisabled()}
                className={`flex items-center justify-center ${
                  isPrevDisabled()
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:opacity-70 cursor-pointer"
                } transition-opacity`}
              >
                <Image
                  src="/icons/chevron-left.svg"
                  alt="이전 달"
                  width={24}
                  height={24}
                />
              </button>
              <button
                onClick={handleNextMonth}
                className="flex items-center justify-center hover:opacity-70 cursor-pointer transition-opacity"
              >
                <Image
                  src="/icons/chevron-right.svg"
                  alt="다음 달"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-0.5 p-2 pb-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-light-black text-sm font-bold"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-0.5 md:gap-0 p-2 pt-1">
          {calendarDays.map((day, index) => {
            const isSelected =
              selectedDate && isSameDay(day.date, selectedDate);
            const isTodayDate = isSameDay(day.date, today);
            const isDisabled = !day.isSelectable;

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day.date)}
                disabled={isDisabled}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded
                  ${
                    isSelected
                      ? "bg-[#03C124] text-white font-bold cursor-pointer"
                      : isDisabled
                      ? "text-[#E5E5E5] cursor-not-allowed"
                      : !day.isCurrentMonth
                      ? "text-[#8F8F8F] cursor-pointer"
                      : "hover:bg-gray-100 cursor-pointer"
                  }
                  
                `}
              >
                {day.date.getDate()}
              </button>
            );
          })}
        </div>

        {/* 선택 완료 버튼 */}
        <div className="p-3 border-t border-gray-200">
          <Button
            variant="bright-green"
            size="medium"
            fullWidth
            onClick={handleConfirm}
            disabled={!tempSelectedDate}
          >
            선택 완료
          </Button>
        </div>
      </div>
    </div>
  );
}
