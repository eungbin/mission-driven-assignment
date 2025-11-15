"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import TextArea from "./components/common/TextArea";
import Label from "./components/common/Label";
import TimeInput from "./components/common/TimeInput";
import Button from "./components/common/Button";
import RepresentativeImageUpload from "./components/image/RepresentativeImageUpload";
import AdditionalImageUpload from "./components/image/AdditionalImageUpload";
import { useCategoryStore } from "./store/categoryStore";
import { useFormStore } from "./store/formStore";
import { useModalStore } from "./store/modalStore";
import { useDatePickerStore } from "./store/datePickerStore";
import { formatDateForDisplay } from "./utils/dateUtils";
import DatePicker from "./components/common/DatePicker";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { selectedCategories } = useCategoryStore();
  const {
    representativeImage,
    setRepresentativeImage,
    additionalImages,
    setAdditionalImages,
    contentTitle,
    setContentTitle,
    activityType,
    setActivityType,
    sessions,
    addSession,
    removeSession,
    updateSession,
  } = useFormStore();
  const { openModal } = useModalStore();
  const { openPicker } = useDatePickerStore();

  const handleDeleteSession = (sessionId: string) => {
    openModal(
      "작성된 내용을 삭제하시겠어요?",
      "삭제한 내용은 복구할 수 없습니다.",
      () => removeSession(sessionId)
    );
  };

  // 카테고리 선택 페이지로 이동
  const handleCategoryClick = () => {
    router.push("/category");
  };

  return (
    <main className="px-4 py-4 md:py-6 pb-24 md:pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 왼쪽 컬럼 - 이미지 업로드 섹션 */}
          <div className="space-y-4 md:space-y-6">
            {/* 대표 이미지 */}
            <RepresentativeImageUpload
              value={representativeImage}
              onChange={setRepresentativeImage}
            />

            {/* 추가 이미지 (선택) */}
            <AdditionalImageUpload
              value={additionalImages}
              onChange={setAdditionalImages}
            />
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
                  {selectedCategories.length > 0 ? (
                    <span>
                      {selectedCategories.join(", ")}
                    </span>
                  ) : (
                    <span className="text-gray-500">주제를 선택해주세요</span>
                  )}
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
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
                rows={4}
                className=""
                errorMessage="8자 이상 입력해주세요."
                preventConsecutiveSpaces={true}
                preventConsecutiveNewlines={true}
              />
            </div>

            {/* 활동 방식 선택 */}
            <div>
              <Label>활동 방식 선택</Label>
              <p className="text-gray-600 text-sm mb-4">
                만남을 어떤 방식으로 진행하시겠어요?
              </p>
              <div className="flex gap-3">
                <Button
                  variant={activityType === "online" ? "outline-green" : "outline-white"}
                  size="large"
                  fullWidth
                  onClick={() => setActivityType("online")}
                >
                  온라인
                </Button>
                <Button
                  variant={activityType === "offline" ? "outline-green" : "outline-white"}
                  size="large"
                  fullWidth
                  onClick={() => setActivityType("offline")}
                >
                  직접 만나기
                </Button>
              </div>
            </div>

            {/* 상세 정보 */}
            <Label className="mb-0">상세 정보</Label>
            <div className="space-y-4 md:space-y-6">
              {/* 회차 정보들 */}
              {sessions.map((session, index) => (
                <div key={session.id} className="p-4 md:p-6 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-md md:text-lg">
                      {sessions.length === 1 ? "회차 정보" : `${index + 1}회차 정보`}
                    </p>
                    {sessions.length > 1 && (
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="hover:opacity-70 transition-opacity cursor-pointer flex items-center justify-center"
                        aria-label="회차 삭제"
                      >
                        <Image src="/icons/x.svg" alt="삭제" width={28} height={28} />
                      </button>
                    )}
                  </div>

                  {/* 날짜 선택 */}
                  <div className="flex items-center gap-4 relative">
                    <Label variant="sub" className="mb-0 w-20 flex-shrink-0">날짜 선택</Label>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        data-session-id={session.id}
                        value={session.date ? formatDateForDisplay(session.date) : ""}
                        readOnly
                        onClick={() => { openPicker(session.id); }}
                        placeholder="날짜를 선택해주세요"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer text-center"
                      />
                      <DatePicker sessionId={session.id} />
                    </div>
                  </div>

                  {/* 시작 시간 */}
                  <TimeInput
                    label="시작 시간"
                    value={session.startTime}
                    onChange={(time) => updateSession(session.id, { startTime: time })}
                  />

                  {/* 종료 시간 */}
                  <TimeInput
                    label="종료 시간"
                    value={session.endTime}
                    onChange={(time) => updateSession(session.id, { endTime: time })}
                  />

                  {/* 활동 내용 */}
                  <div>
                    <p className="font-bold text-md md:text-lg">활동 내용</p>
                    <p className="text-gray-500 text-sm mb-3">
                      날짜별 활동 내용을 간단히 적어주세요
                    </p>
                    <div className="relative">
                      <textarea
                        value={session.content}
                        onChange={(e) => updateSession(session.id, { content: e.target.value })}
                        placeholder="활동 내용을 간단히 입력해주세요"
                        rows={6}
                        maxLength={800}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                      />
                      <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
                        {session.content.length}/800자(최소 8자)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 회차 추가하기 버튼 */}
            <div className="mt-4 md:mt-6">
              <Button variant="dark-gray" size="large" fullWidth onClick={addSession}>
                회차 추가하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
