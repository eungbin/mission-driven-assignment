"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../common/Button";
import { useCategoryStore } from "../../store/categoryStore";
import { useFormStore } from "../../store/formStore";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { tempSelectedCategories, applyTempToSelected, revertTempToSelected, selectedCategories } = useCategoryStore();
  const {
    representativeImage,
    contentTitle,
    activityType,
    sessions,
  } = useFormStore();

  // 메인 페이지에서 다음으로 버튼 활성화 조건
  const canProceedFromMain = () => {
    // 1. 대표 이미지가 있어야 함
    if (!representativeImage.file && !representativeImage.preview) {
      return false;
    }

    // 2. 카테고리가 최소 1개 이상 선택되어 있어야 함
    if (selectedCategories.length < 1) {
      return false;
    }

    // 3. 콘텐츠 제목이 8자 이상 작성되어 있어야 함
    if (contentTitle.length < 8) {
      return false;
    }

    // 4. 활동 방식이 선택되어 있어야 함
    if (activityType === null) {
      return false;
    }

    // 5. 상세 정보 내의 모든 회차 정보가 완료되어 있어야 함
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

  // 나가기 버튼 클릭 핸들러
  const handleGoBack = () => {
    revertTempToSelected(); // 임시 상태를 최종 상태로 되돌림
    router.push("/");
  };

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

  return (
    <header className="sticky top-0 z-999 bg-white">
      <div className="max-w-6xl mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-between py-4 relative min-h-[60px]">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 font-medium text-lg">
            과제
          </h1>
          
          {/* 왼쪽: 카테고리 페이지에서만 나가기 버튼 표시 */}
          {isCategoryPage && (
            <>
              {/* 모바일: X 아이콘 */}
              <button
                onClick={handleGoBack}
                className="md:hidden hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center"
                aria-label="나가기"
              >
                <Image src="/icons/x.svg" alt="나가기" width={28} height={28} />
              </button>
              {/* 데스크톱: 나가기 버튼 */}
              <Button
                variant="outline-white"
                size="small"
                onClick={handleGoBack}
                className="hidden md:block w-30"
              >
                나가기
              </Button>
            </>
          )}
          
          {/* 오른쪽: 다음으로 버튼 */}
          <div className="ml-auto">
            {isCategoryPage && (
              <Button
                variant={canProceedFromCategory ? "bright-green" : "light-gray"}
                size="small"
                onClick={handleNext}
                disabled={!canProceedFromCategory}
                className="hidden md:block w-30"
              >
                다음으로
              </Button>
            )}
            {isMainPage && (
              <Button
                variant={canProceedFromMain() ? "bright-green" : "light-gray"}
                size="small"
                onClick={handleNext}
                disabled={!canProceedFromMain()}
                className="hidden md:block ml-auto w-30"
              >
                다음으로
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-300 w-full"></div>
    </header>
  );
}

