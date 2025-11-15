"use client";

import { useEffect } from "react";
import Button from "../components/common/Button";
import { useCategoryStore } from "../store/categoryStore";

const categories = [
  "용돈벌기",
  "디지털",
  "그림",
  "글쓰기/독서",
  "건강/운동",
  "동기부여/성장",
  "취미힐링",
  "외국어",
];

export default function CategoryPage() {
  const { tempSelectedCategories, setTempSelectedCategories, resetTempToSelected } = useCategoryStore();

  // 페이지 진입 시 최종 선택 상태로 임시 상태 초기화
  useEffect(() => {
    resetTempToSelected();
  }, [resetTempToSelected]);

  const handleCategoryClick = (category: string) => {
    setTempSelectedCategories(
      tempSelectedCategories.includes(category)
        ? // 이미 선택된 경우 제거
          tempSelectedCategories.filter((c) => c !== category)
        : // 최대 2개까지 선택 가능
          tempSelectedCategories.length < 2
          ? [...tempSelectedCategories, category]
          : tempSelectedCategories
    );
  };

  return (
    <main className="px-4 py-4 md:py-6 pb-24 md:pb-6">
      <div className="max-w-6xl mx-auto">
        {/* 제목 및 부제목 */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
            어떤 카테고리의 콘텐츠를 만드시나요?
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            최대 2개까지 선택 가능합니다.
          </p>
        </div>

        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {categories.map((category, idx) => {
            const isSelected = tempSelectedCategories.includes(category);
            return (
              <Button
                key={idx}
                variant={isSelected ? "outline-green" : "outline-white"}
                size="large"
                fullWidth
                onClick={() => handleCategoryClick(category)}
                className={`
                  transition-all duration-200
                `}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
