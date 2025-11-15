"use client";

import { useState, useRef } from "react";
import Button from "../common/Button";

interface TimeInputProps {
  label: string;
  hour?: string;
  minute?: string;
  period?: "오전" | "오후";
  onHourChange?: (hour: string) => void;
  onMinuteChange?: (minute: string) => void;
  onPeriodChange?: (period: "오전" | "오후") => void;
  value?: { hour: string; minute: string; period: "오전" | "오후" };
  onChange?: (time: { hour: string; minute: string; period: "오전" | "오후" }) => void;
  onBlur?: (time: { hour: string; minute: string; period: "오전" | "오후" }) => void;
}

export default function TimeInput({
  label,
  hour = "10",
  minute = "00",
  period = "오전",
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  value,
  onChange,
  onBlur,
}: TimeInputProps) {
  // controlled component인지 확인
  const isControlled = value !== undefined;
  
  const [internalPeriod, setInternalPeriod] = useState<"오전" | "오후">(period);
  const [internalHour, setInternalHour] = useState(hour);
  const [internalMinute, setInternalMinute] = useState(minute);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const displayPeriod = isControlled ? value.period : internalPeriod;
  const displayHour = isControlled ? value.hour : internalHour;
  const displayMinute = isControlled ? value.minute : internalMinute;

  const handlePeriodToggle = () => {
    const newPeriod = displayPeriod === "오전" ? "오후" : "오전";
    if (!isControlled) {
      setInternalPeriod(newPeriod);
    }
    onPeriodChange?.(newPeriod);
    onChange?.({ hour: displayHour, minute: displayMinute, period: newPeriod });
  };

  // 숫자만 허용하는 함수
  const isNumeric = (value: string): boolean => {
    return /^\d*$/.test(value);
  };

  // 시간 범위 검증 및 보정 (0-12)
  const validateAndCorrectHour = (hour: string): string => {
    if (!hour) return "00";
    const num = parseInt(hour, 10);
    if (isNaN(num)) return "00";
    if (num < 0) return "00";
    if (num > 12) return "12";
    return String(num).padStart(2, "0");
  };

  // 분 범위 검증 및 보정 (0-59, 빈 값은 "00"으로 보정)
  const validateAndCorrectMinute = (minute: string): string => {
    if (!minute) return "00";
    const num = parseInt(minute, 10);
    if (isNaN(num)) return "00";
    if (num < 0) return "00";
    if (num > 59) return "59";
    return String(num).padStart(2, "0");
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = e.target.value;
    
    // 숫자만 허용
    if (!isNumeric(newHour)) {
      return;
    }
    
    // 최대 2자리까지만 허용
    if (newHour.length > 2) {
      newHour = newHour.slice(0, 2);
    }
    
    if (!isControlled) {
      setInternalHour(newHour);
    }
    onHourChange?.(newHour);
    onChange?.({ hour: newHour, minute: displayMinute, period: displayPeriod });
  };

  const handleHourBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let correctedHour = validateAndCorrectHour(e.target.value);
    const originalHour = e.target.value;
    
    // 오전 12시는 오전 00시로 변환
    if (displayPeriod === "오전" && correctedHour === "12") {
      correctedHour = "00";
    }
    // 오후 00시는 오후 12시로 변환
    else if (displayPeriod === "오후" && correctedHour === "00") {
      correctedHour = "12";
    }
    
    // 값이 변경된 경우 업데이트
    if (correctedHour !== originalHour) {
      if (!isControlled) {
        setInternalHour(correctedHour);
      }
      onHourChange?.(correctedHour);
      onChange?.({ hour: correctedHour, minute: displayMinute, period: displayPeriod });
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinute = e.target.value;
    
    // 숫자만 허용
    if (!isNumeric(newMinute)) {
      return;
    }
    
    // 최대 2자리까지만 허용
    if (newMinute.length > 2) {
      newMinute = newMinute.slice(0, 2);
    }
    
    if (!isControlled) {
      setInternalMinute(newMinute);
    }
    onMinuteChange?.(newMinute);
    onChange?.({ hour: displayHour, minute: newMinute, period: displayPeriod });
  };

  const handleMinuteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const correctedMinute = validateAndCorrectMinute(e.target.value);
    
    if (correctedMinute !== e.target.value) {
      if (!isControlled) {
        setInternalMinute(correctedMinute);
      }
      onMinuteChange?.(correctedMinute);
      onChange?.({ hour: displayHour, minute: correctedMinute, period: displayPeriod });
    }
  };

  // 전체 시간 입력 필드가 blur될 때 호출
  const handleTimeBlur = (hour?: string, minute?: string) => {
    let finalHour = hour ?? validateAndCorrectHour(displayHour);
    const finalMinute = minute ?? validateAndCorrectMinute(displayMinute);
    
    // 오전 12시는 오전 00시로 변환
    if (displayPeriod === "오전" && finalHour === "12") {
      finalHour = "00";
    }
    // 오후 00시는 오후 12시로 변환
    else if (displayPeriod === "오후" && finalHour === "00") {
      finalHour = "12";
    }
    
    const finalTime = {
      hour: finalHour,
      minute: finalMinute,
      period: displayPeriod,
    };
    onBlur?.(finalTime);
  };

  // 숫자만 입력 가능하도록 키 입력 제한
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 숫자, 백스페이스, 삭제, 탭, 화살표 키만 허용
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowDown" &&
      !(e.ctrlKey && (e.key === "a" || e.key === "c" || e.key === "v" || e.key === "x"))
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label className="block text-gray-700 text-sm mb-0 w-20 flex-shrink-0">
        {label}
      </label>
      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden w-full">
        <Button variant="outline-white" size="small" onClick={handlePeriodToggle} className="m-2">
          {displayPeriod}
        </Button>
        <div 
          ref={containerRef}
          className="flex items-center gap-2 px-4 flex-1 justify-center"
          onBlur={(e) => {
            // 컨테이너 밖으로 포커스가 이동한 경우에만 handleTimeBlur 호출
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setTimeout(() => {
                const correctedHour = validateAndCorrectHour(displayHour);
                let finalHour = correctedHour;
                if (displayPeriod === "오전" && finalHour === "12") {
                  finalHour = "00";
                } else if (displayPeriod === "오후" && finalHour === "00") {
                  finalHour = "12";
                }
                const correctedMinute = validateAndCorrectMinute(displayMinute);
                handleTimeBlur(finalHour, correctedMinute);
              }, 0);
            }
          }}
        >
          <input
            type="text"
            value={displayHour}
            onChange={handleHourChange}
            onBlur={handleHourBlur}
            onKeyDown={handleKeyDown}
            placeholder="00"
            maxLength={2}
            className="w-14 px-2 py-3 bg-transparent text-center text-sm focus:outline-none border-none"
          />
          <span className="text-gray-400 text-lg">:</span>
          <input
            type="text"
            value={displayMinute}
            onChange={handleMinuteChange}
            onBlur={handleMinuteBlur}
            onKeyDown={handleKeyDown}
            placeholder="00"
            maxLength={2}
            className="w-14 px-2 py-3 bg-transparent text-center text-sm focus:outline-none border-none"
          />
        </div>
      </div>
    </div>
  );
}

