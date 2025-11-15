"use client";

import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import { useCategoryStore } from "../../store/categoryStore";

export default function MobileBottomButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { tempSelectedCategories, applyTempToSelected } = useCategoryStore();

  // 메인 페이지에서 다음으로 버튼 활성화 조건 (나중에 확장 가능)
  const canProceedFromMain = () => {
    // TODO: 나중에 조건 추가 예정
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

