"use client";

import { useState, useRef } from "react";
import Label from "../common/Label";

interface RepresentativeImageUploadProps {
  onFileChange?: (file: File | null) => void;
  maxSize?: number; // bytes, 기본값 15MB
}

export default function RepresentativeImageUpload({
  onFileChange,
  maxSize = 15 * 1024 * 1024, // 15MB
}: RepresentativeImageUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);  // 미리보기 이미지
  const [selectedFile, setSelectedFile] = useState<File | null>(null);    // 선택된 파일
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  // 에러 메시지
  const fileInputRef = useRef<HTMLInputElement>(null);                    // 파일 입력 요소 참조 ref

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 용량 체크 (15MB 제한, 초과 시 에러 메시지 보여준 후 초기화)
    if (file.size > maxSize) {
      setErrorMessage("이미지 용량은 15MB를 초과할 수 없습니다.");
      e.target.value = ""; // input 초기화
      return;
    }

    // 이미지 파일 타입 체크 (.jpg(.jpeg)와 .png만 허용)
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const fileName = file.name.toLowerCase();
    
    const isValidMimeType = allowedMimeTypes.includes(file.type);
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    // 파일 타입 또는 확장자가 유효하지 않으면 에러 메시지 보여준 후 초기화
    if (!isValidMimeType || !hasValidExtension) {
      setErrorMessage("JPG 또는 PNG 파일만 업로드 가능합니다.");
      e.target.value = "";
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    onFileChange?.(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
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
            <button
              type="button"
              className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              이미지 업로드
            </button>
          </>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
}

