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
  preventConsecutiveSpaces?: boolean; // 연속 공백 방지
  preventConsecutiveNewlines?: boolean; // 연속 개행문자 방지
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
  preventConsecutiveSpaces = false,
  preventConsecutiveNewlines = false,
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
    let newValue = e.target.value;
    
    // 최대 글자수 제한
    if (newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    // 연속 공백 방지
    if (preventConsecutiveSpaces) {
      newValue = newValue.replace(/  +/g, ' '); // 연속 공백을 하나로
    }
    
    // 연속 개행문자 방지 (2개 이상의 개행문자를 하나로)
    if (preventConsecutiveNewlines) {
      newValue = newValue.replace(/\n\n+/g, '\n'); // 연속 개행문자를 하나로
    }
    
    // 최대 글자수 재확인 (연속 공백/개행 처리 후 길이가 변경될 수 있음)
    if (newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    // 값이 변경된 경우에만 이벤트 발생
    if (newValue !== e.target.value) {
      e.target.value = newValue;
    }
    
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
        onKeyDown={(e) => {
          const textarea = e.currentTarget;
          const currentValue = textarea.value;
          const cursorPos = textarea.selectionStart;
          const selectionEnd = textarea.selectionEnd;
          const selectedText = currentValue.substring(cursorPos, selectionEnd);
          
          // 최대 글자수 체크: 일반 입력 키인 경우
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const textBefore = currentValue.substring(0, cursorPos);
            const textAfter = currentValue.substring(selectionEnd);
            const newLength = textBefore.length + textAfter.length + 1; // +1은 입력될 문자
            if (newLength > maxLength) {
              e.preventDefault();
              return;
            }
          }
          
          // 연속 개행문자 방지: 현재 커서 위치 앞이 개행문자이고 Enter를 누르면 차단
          if (preventConsecutiveNewlines && e.key === 'Enter') {
            const textBeforeCursor = currentValue.substring(0, cursorPos);
            // 커서 바로 앞이 개행문자면 Enter 차단
            if (textBeforeCursor.endsWith('\n')) {
              e.preventDefault();
              return;
            }
            // Enter 키 입력 시 최대 글자수 체크
            if (currentValue.length - selectedText.length >= maxLength) {
              e.preventDefault();
              return;
            }
          }
        }}
        onPaste={(e) => {
          // 연속 개행문자나 연속 공백 방지가 활성화된 경우 붙여넣기 처리
          if (preventConsecutiveNewlines || preventConsecutiveSpaces) {
            e.preventDefault();
            let pastedText = e.clipboardData.getData('text');
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            
            // 붙여넣기 위치 앞뒤 확인
            const textBefore = textarea.value.substring(0, start);
            const textAfter = textarea.value.substring(end);
            
            // 붙여넣기 위치 앞이 개행문자이고 붙여넣을 텍스트가 개행문자로 시작하면 제거
            if (preventConsecutiveNewlines && textBefore.endsWith('\n') && pastedText.startsWith('\n')) {
              pastedText = pastedText.replace(/^\n+/, '');
            }
            
            // 최대 글자수 체크: 붙여넣을 텍스트 길이 조정
            const availableLength = maxLength - (textBefore.length + textAfter.length);
            if (availableLength <= 0) {
              return; // 공간이 없으면 붙여넣기 차단
            }
            if (pastedText.length > availableLength) {
              pastedText = pastedText.slice(0, availableLength);
            }
            
            let newValue = textBefore + pastedText + textAfter;
            
            // 연속 공백 방지
            if (preventConsecutiveSpaces) {
              newValue = newValue.replace(/  +/g, ' ');
            }
            
            // 연속 개행문자 방지
            if (preventConsecutiveNewlines) {
              newValue = newValue.replace(/\n\n+/g, '\n');
            }
            
            // 최대 글자수 재확인
            if (newValue.length > maxLength) {
              newValue = newValue.slice(0, maxLength);
            }
            
            if (isControlled) {
              const syntheticEvent = {
                target: { value: newValue },
                currentTarget: textarea,
              } as React.ChangeEvent<HTMLTextAreaElement>;
              handleChange(syntheticEvent);
            } else {
              setInternalValue(newValue);
              textarea.value = newValue;
              const newCursorPos = Math.min(start + pastedText.length, maxLength);
              textarea.setSelectionRange(newCursorPos, newCursorPos);
            }
          } else {
            // 연속 개행/공백 방지가 없어도 최대 글자수 체크
            e.preventDefault();
            let pastedText = e.clipboardData.getData('text');
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const textBefore = textarea.value.substring(0, start);
            const textAfter = textarea.value.substring(end);
            
            // 최대 글자수 체크
            const availableLength = maxLength - (textBefore.length + textAfter.length);
            if (availableLength <= 0) {
              return;
            }
            if (pastedText.length > availableLength) {
              pastedText = pastedText.slice(0, availableLength);
            }
            
            const newValue = textBefore + pastedText + textAfter;
            
            if (isControlled) {
              const syntheticEvent = {
                target: { value: newValue },
                currentTarget: textarea,
              } as React.ChangeEvent<HTMLTextAreaElement>;
              handleChange(syntheticEvent);
            } else {
              setInternalValue(newValue);
              textarea.value = newValue;
              const newCursorPos = Math.min(start + pastedText.length, maxLength);
              textarea.setSelectionRange(newCursorPos, newCursorPos);
            }
          }
        }}
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

