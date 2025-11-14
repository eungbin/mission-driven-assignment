"use client";

import { useRouter } from "next/navigation";
import TextArea from "./components/common/TextArea";
import Label from "./components/common/Label";
import TimeInput from "./components/common/TimeInput";
import RepresentativeImageUpload from "./components/image/RepresentativeImageUpload";
import AdditionalImageUpload from "./components/image/AdditionalImageUpload";

export default function Home() {
  const router = useRouter();

  // 카테고리 선택 페이지로 이동
  const handleCategoryClick = () => {
    router.push("/category");
  };

  return (
    <main className="px-4 py-4 md:py-6 pb-24 md:pb-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 왼쪽 컬럼 - 이미지 업로드 섹션 */}
          <div className="space-y-4 md:space-y-6">
            {/* 대표 이미지 */}
            <RepresentativeImageUpload />

            {/* 추가 이미지 (선택) */}
            <AdditionalImageUpload />
          </div>

          {/* 오른쪽 컬럼 - 폼 필드 섹션 */}
          <div className="space-y-4 md:space-y-6">
            {/* 카테고리 */}
            <div>
              <Label htmlFor="category">카테고리</Label>
              <div className="relative">
                <button
                  type="button"
                  id="category"
                  onClick={handleCategoryClick}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-400 text-left bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-gray-500">주제를 선택해주세요</span>
                </button>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  &gt;
                </span>
              </div>
            </div>

            {/* 콘텐츠 제목 */}
            <div>
              <Label>콘텐츠 제목</Label>
              <TextArea
                placeholder="제목을 입력해주세요"
                rows={4}
                className=""
                errorMessage="8자 이상 입력해주세요."
              />
            </div>

            {/* 활동 방식 선택 */}
            <div>
              <Label>활동 방식 선택</Label>
              <p className="text-gray-600 text-sm mb-4">
                만남을 어떤 방식으로 진행하시겠어요?
              </p>
              <div className="flex gap-3">
                <button className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors">
                  온라인
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                  직접 만나기
                </button>
              </div>
            </div>

            {/* 상세 정보 */}
            <Label className="mb-0">상세 정보</Label>
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 space-y-4 md:space-y-6">
              {/* 회차 정보 */}
              <div className="space-y-4">
                <p className="text-black font-bold text-md md:text-lg">회차 정보</p>

                {/* 날짜 선택 */}
                <div className="flex items-center gap-4">
                  <Label variant="sub" className="mb-0 w-20 flex-shrink-0">날짜 선택</Label>
                  <input
                    type="text"
                    placeholder="날짜를 선택해주세요"
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                {/* 시작 시간 */}
                <TimeInput
                  label="시작 시간"
                  hour="10"
                  minute="00"
                  period="오전"
                />

                {/* 종료 시간 */}
                <TimeInput
                  label="종료 시간"
                  hour="11"
                  minute="00"
                  period="오전"
                />
              </div>

              {/* 활동 내용 */}
              <div>
              <p className="text-black font-bold text-md md:text-lg">활동 내용</p>
                <p className="text-gray-500 text-sm mb-3">
                  날짜별 활동 내용을 간단히 적어주세요
                </p>
                <div className="relative">
                  <textarea
                    placeholder="활동 내용을 간단히 입력해주세요"
                    rows={6}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
                    0/800자(최소 8자)
                  </div>
                </div>
              </div>
            </div>

            {/* 회차 추가하기 버튼 */}
            <div className="mt-4 md:mt-6">
              <button className="w-full bg-gray-700 text-white px-6 py-3 md:py-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                회차 추가하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 md:hidden z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button className="w-full bg-gray-400 text-white px-5 py-3 rounded text-sm font-medium hover:bg-gray-500 transition-colors">
            다음으로
          </button>
        </div>
      </div>
    </main>
  );
}
