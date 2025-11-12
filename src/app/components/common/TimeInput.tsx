"use client";

import { useState } from "react";

interface TimeInputProps {
  label: string;
  hour?: string;
  minute?: string;
  period?: "오전" | "오후";
  onHourChange?: (hour: string) => void;
  onMinuteChange?: (minute: string) => void;
  onPeriodChange?: (period: "오전" | "오후") => void;
}

export default function TimeInput({
  label,
  hour = "10",
  minute = "00",
  period = "오전",
  onHourChange,
  onMinuteChange,
  onPeriodChange,
}: TimeInputProps) {
  const [currentPeriod, setCurrentPeriod] = useState<"오전" | "오후">(period);
  const [currentHour, setCurrentHour] = useState(hour);
  const [currentMinute, setCurrentMinute] = useState(minute);

  const handlePeriodToggle = () => {
    const newPeriod = currentPeriod === "오전" ? "오후" : "오전";
    setCurrentPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = e.target.value;
    setCurrentHour(newHour);
    onHourChange?.(newHour);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = e.target.value;
    setCurrentMinute(newMinute);
    onMinuteChange?.(newMinute);
  };

  return (
    <div className="flex items-center gap-4">
      <label className="block text-gray-700 text-sm mb-0 w-20 flex-shrink-0">
        {label}
      </label>
      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden w-full">
        <button
          type="button"
          onClick={handlePeriodToggle}
          className="px-3 py-2 m-2 text-sm bg-gray-100 border-1 rounded-md border-gray-200 focus:outline-none hover:bg-gray-200 transition-colors"
        >
          {currentPeriod}
        </button>
        <div className="flex items-center gap-2 px-4 flex-1 justify-center">
          <input
            type="text"
            value={currentHour}
            onChange={handleHourChange}
            className="w-14 px-2 py-3 bg-transparent text-center text-sm focus:outline-none border-none"
          />
          <span className="text-gray-400 text-lg">:</span>
          <input
            type="text"
            value={currentMinute}
            onChange={handleMinuteChange}
            className="w-14 px-2 py-3 bg-transparent text-center text-sm focus:outline-none border-none"
          />
        </div>
      </div>
    </div>
  );
}

