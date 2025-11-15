"use client";

import { useState } from "react";
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
}: TimeInputProps) {
  // controlled component인지 확인
  const isControlled = value !== undefined;
  
  const [internalPeriod, setInternalPeriod] = useState<"오전" | "오후">(period);
  const [internalHour, setInternalHour] = useState(hour);
  const [internalMinute, setInternalMinute] = useState(minute);
  
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

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = e.target.value;
    if (!isControlled) {
      setInternalHour(newHour);
    }
    onHourChange?.(newHour);
    onChange?.({ hour: newHour, minute: displayMinute, period: displayPeriod });
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = e.target.value;
    if (!isControlled) {
      setInternalMinute(newMinute);
    }
    onMinuteChange?.(newMinute);
    onChange?.({ hour: displayHour, minute: newMinute, period: displayPeriod });
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
        <div className="flex items-center gap-2 px-4 flex-1 justify-center">
          <input
            type="text"
            value={displayHour}
            onChange={handleHourChange}
            className="w-14 px-2 py-3 bg-transparent text-center text-sm focus:outline-none border-none"
          />
          <span className="text-gray-400 text-lg">:</span>
          <input
            type="text"
            value={displayMinute}
            onChange={handleMinuteChange}
            className="w-14 px-2 py-3 bg-transparent text-center text-sm focus:outline-none border-none"
          />
        </div>
      </div>
    </div>
  );
}

