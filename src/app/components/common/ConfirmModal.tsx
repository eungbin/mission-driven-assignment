"use client";

import { useModalStore } from "../../store/modalStore";
import Button from "./Button";
import Image from "next/image";

export default function ConfirmModal() {
  const { isOpen, title, message, onConfirm, closeModal } = useModalStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={handleCancel}
      />
      
      {/* 모달 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 pointer-events-auto">
          {/* 모달 헤더 */}
          <div className="flex items-center justify-end p-4">
            <button
              onClick={handleCancel}
              className="hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center"
              aria-label="닫기"
            >
              <Image src="/icons/x.svg" alt="닫기" width={28} height={28} />
            </button>
          </div>

          {/* 모달 내용 */}
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-black font-bold text-lg md:text-xl mb-2">
                {title}
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-6">
                {message}
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <Button
                variant="outline-white"
                size="small"
                fullWidth
                className="btn-medium-md-large"
                onClick={handleCancel}
              >
                취소
              </Button>
              <Button
                variant="dark-gray"
                size="small"
                fullWidth
                className="btn-medium-md-large"
                onClick={handleConfirm}
              >
                삭제하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

