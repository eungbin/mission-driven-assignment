"use client";

import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import { useCategoryStore } from "../../store/categoryStore";
import { useFormStore } from "../../store/formStore";

export default function MobileBottomButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { tempSelectedCategories, applyTempToSelected, selectedCategories } = useCategoryStore();
  const {
    representativeImage,
    contentTitle,
    activityType,
    sessions,
  } = useFormStore();

  // 메인 페이지에서 다음으로 버튼 활성화 조건
  const canProceedFromMain = () => {
    // 대표 이미지가 있어야 함
    if (!representativeImage.file && !representativeImage.preview) {
      return false;
    }

    // 카테고리가 최소 1개 이상 선택되어 있어야 함
    if (selectedCategories.length < 1) {
      return false;
    }

    // 콘텐츠 제목이 8자 이상 작성되어 있어야 함
    if (contentTitle.length < 8) {
      return false;
    }

    // 활동 방식이 선택되어 있어야 함
    if (activityType === null) {
      return false;
    }

    // 상세 정보 내의 모든 회차 정보가 완료되어 있어야 함
    for (const session of sessions) {
      // 날짜가 입력되어 있어야 함
      if (!session.date || session.date === "") {
        return false;
      }

      // 시간들이 모두 입력되어 있어야 함 (기본값이 아닌 실제 입력값인지 확인)
      // startTime과 endTime이 유효한지 확인
      if (!session.startTime || !session.endTime) {
        return false;
      }

      // 활동 내용이 8자 이상 작성되어 있어야 함
      if (!session.content || session.content.length < 8) {
        return false;
      }
    }

    return true;
  };

  // 카테고리 페이지에서 다음으로 버튼 활성화 조건
  const canProceedFromCategory = tempSelectedCategories.length >= 1;

  // 다음으로 버튼 클릭 핸들러
  const handleNext = () => {
    if (pathname === "/category") {
      // 카테고리 페이지에서 다음으로
      applyTempToSelected(); // 임시 상태를 최종 상태로 적용
      router.push("/");
    } else if (pathname === "/") {
      // 메인 페이지에서 다음으로
      if (canProceedFromMain()) {
        // TODO: 나중에 다음 동작 추가
      }
    }
  };

  const isCategoryPage = pathname === "/category";
  const isMainPage = pathname === "/";

  // 카테고리 페이지나 메인 페이지가 아니면 표시하지 않음
  if (!isCategoryPage && !isMainPage) {
    return null;
  }

  // 활성화 조건 결정
  const isEnabled = isCategoryPage ? canProceedFromCategory : canProceedFromMain();
  
  // variant 결정
  const variant = isEnabled ? "bright-green" : "light-gray";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 md:hidden z-999">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Button
          variant={variant}
          size="medium"
          fullWidth
          onClick={handleNext}
          disabled={!isEnabled}
        >
          다음으로
        </Button>
      </div>
    </div>
  );
}

