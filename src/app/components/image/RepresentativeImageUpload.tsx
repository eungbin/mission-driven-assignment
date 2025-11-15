"use client";

import { useState, useRef } from "react";
import Label from "../common/Label";
import { validateImageFile, readFileAsDataURL } from "../../utils/imageUtils";
import Button from "../common/Button";

interface RepresentativeImageUploadProps {
  onFileChange?: (file: File | null) => void;
  maxSize?: number; // bytes, 기본값 15MB
  value?: { file: File | null; preview: string | null };
  onChange?: (file: File | null, preview: string | null) => void;
}

export default function RepresentativeImageUpload({
  onFileChange,
  maxSize = 15 * 1024 * 1024, // 15MB
  value,
  onChange,
}: RepresentativeImageUploadProps) {
  const isControlled = value !== undefined;
  const [internalPreview, setInternalPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const previewImage = isControlled ? value.preview : internalPreview;

  /**
   * 이미지 업로드 영역 클릭 시 호출되는 핸들러 함수
   * 사용자가 업로드 영역을 클릭할 경우 파일 입력 요소 클릭이 트리거되어 파일 선택 기능 실행
   */
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * 파일 선택 시 호출되는 핸들러 함수
   * 사용자가 이미지 파일을 선택하면 해당 파일을 처리하고 미리보기 이미지를 생성
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검증
    const validation = validateImageFile(file, maxSize);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage);
      e.target.value = ""; // input 초기화
      return;
    }

    setErrorMessage(null);
    onFileChange?.(file);

    // 미리보기 생성
    try {
      const preview = await readFileAsDataURL(file);
      if (!isControlled) {
        setInternalPreview(preview);
      }
      onChange?.(file, preview);
    } catch {
      setErrorMessage("이미지 미리보기 생성 중 오류가 발생했습니다.");
      e.target.value = "";
    }
  };


  return (
    <div>
      <Label>대표 이미지</Label>
      <div
        onClick={handleImageClick}
        className="bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        {previewImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="대표 이미지 미리보기"
              className="w-full h-full object-cover rounded-lg"
            />
          </>
        ) : (
          <>
            <p className="text-black text-center mb-2">
              콘텐츠 대표 이미지를 등록해 주세요!
            </p>
            <p className="text-gray-500 text-sm text-center mb-6">
              1:1 비율의 정사각형 이미지를 추천합니다
            </p>
            <Button variant="dark-gray" size="large">
              이미지 업로드
            </Button>
          </>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
}

