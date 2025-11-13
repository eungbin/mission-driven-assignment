"use client";

import { useState, useRef } from "react";
import Label from "../common/Label";
import ImageUploadIcon from "../common/ImageUploadIcon";
import { validateImageFile, readFileAsDataURL } from "../../utils/imageUtils";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface AdditionalImageUploadProps {
  onFilesChange?: (files: File[]) => void;
  maxSize?: number; // bytes, 기본값 15MB
  maxCount?: number; // 기본값 4
}

export default function AdditionalImageUpload({
  onFilesChange,
  maxSize = 15 * 1024 * 1024, // 15MB
  maxCount = 4,
}: AdditionalImageUploadProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);


  /**
   * 이미지 추가 함수
   * 새 이미지를 배열 앞에 추가합니다 (뒤로 밀리는 구조).
   */
  const addImage = async (file: File, targetIndex?: number) => {
    // 파일 유효성 검증
    const validation = validateImageFile(file, maxSize);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage);
      return;
    }

    // 최대 개수 체크
    if (targetIndex === undefined && images.length >= maxCount) {
      setErrorMessage(`최대 ${maxCount}장까지 등록할 수 있습니다.`);
      return;
    }

    setErrorMessage(null);

    // 미리보기 생성
    try {
      const preview = await readFileAsDataURL(file);
      const newImage: ImageItem = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview,
      };

      setImages((prev) => {
        let newImages: ImageItem[];

        if (targetIndex !== undefined) {
          // 특정 인덱스에 이미지 교체
          newImages = [...prev];
          newImages[targetIndex] = newImage;
        } else {
          // 새 이미지를 배열 앞에 추가 (뒤로 밀리는 구조)
          newImages = [newImage, ...prev];
        }

        // 파일 배열 업데이트
        const files = newImages.map((img) => img.file);
        onFilesChange?.(files);

        return newImages;
      });
    } catch {
      setErrorMessage("이미지 미리보기 생성 중 오류가 발생했습니다.");
    }
  };

  /**
   * 파일 선택 핸들러 (새 이미지 추가용)
   */
  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addImage(file);
    e.target.value = ""; // input 초기화
  };

  /**
   * 업로드 영역 클릭 핸들러
   */
  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  /**
   * 이미지 클릭 핸들러 (이미지 교체용)
   */
  const handleImageClick = (index: number) => {
    // 동적으로 input 생성하여 클릭
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,.jpg,.jpeg,.png";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        addImage(file, index);
      }
    };
    input.click();
  };

  return (
    <div>
      <Label>추가 이미지 (선택)</Label>
      <p className="text-gray-600 text-sm mb-3">
        최대 {maxCount}장까지 등록할 수 있어요
      </p>

      {/* 모바일: 가로 스크롤, PC: 2x2 그리드 */}
      <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-x-visible snap-x md:snap-none">
        {/* 업로드된 이미지들 */}
        {images.map((image, index) => (
          <div
            key={image.id}
            className="flex-shrink-0 w-[180px] md:w-full snap-start"
          >
            <div
              onClick={() => handleImageClick(index)}
              className="bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.preview}
                alt={`추가 이미지 ${index + 1} 미리보기`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        ))}

        {/* 업로드 영역 (최대 개수 미만일 때만 표시) */}
        {images.length < maxCount && (
          <div className="flex-shrink-0 w-[180px] md:w-full snap-start">
            <div
              onClick={handleUploadClick}
              className="bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden"
            >
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                onChange={handleUploadFileChange}
                className="hidden"
              />
              <ImageUploadIcon />
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
}

