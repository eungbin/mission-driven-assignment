"use client";

import { useState, useRef } from "react";

interface TextAreaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
}

export default function TextArea({
  value,
  defaultValue,
  onChange,
  placeholder = "텍스트를 입력해주세요",
  maxLength = 80,
  minLength = 8,
  rows = 4,
  errorMessage,
  className = "",
  disabled = false,
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * controlled component인지 확인 (value prop이 제공되면 controlled)
   * controlled component: 부모 컴포넌트에서 상태를 관리
   * uncontrolled component: 내부에서 상태를 관리
   * 
   * controlled component를 사용할 때
   * 1. 폼 검증이 필요할 때
   * 2. 여러 입력값을 한번에 관리할 때
   * 3. 부모 컴포넌트에서 값을 제어해야 할 때
   * 
   * uncontrolled component를 사용할 때
   * 1. 간단한 입력 필드일 때
   * 2. 값이 변경될 때마다 부모 컴포넌트에 알리고 싶지 않을 때
   * 3. 부모 컴포넌트에서 값을 제어하지 않을 때
   * 
   * 일반적으로 폼 입력 필드는 controlled component를 사용하는 것이 좋음
   * 하지만 간단한 입력 필드일 때는 uncontrolled component를 사용할 수 있음
   */
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(e);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const currentLength = currentValue.length;
  // 글자수가 minLength 미만일 때 에러 상태로 설정 (빈 값은 에러 아님)
  const isError = currentValue.length > 0 && currentValue.length < minLength;

  // border 색상 결정: error > focus > default
  const getBorderColor = () => {
    if (isError) return "border-red-500 focus:border-red-500";
    if (isFocused) return "border-green-500 focus:border-green-500";
    return "border-gray-300 focus:border-gray-400";
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        rows={rows}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none resize-none transition-colors ${getBorderColor()} ${className}`}
      />
      <div className="absolute bottom-3 right-3 text-gray-500 text-sm pointer-events-none">
        {currentLength}/{maxLength}자(최소 {minLength}자)
      </div>
      {isError && errorMessage && (
        <div className="mt-1 text-red-500 text-sm">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

