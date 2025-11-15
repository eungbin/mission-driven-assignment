import { create } from "zustand";

interface DatePickerStore {
  isOpen: boolean;
  currentSessionId: string | null;
  tempSelectedDate: string | null; // YYYY-MM-DD 형식
  openPicker: (sessionId: string) => void;
  closePicker: () => void;
  setTempDate: (date: string | null) => void; // YYYY-MM-DD 형식
  confirmDate: () => void; // DatePicker 컴포넌트에서 직접 updateSession 호출 후 이 함수 호출
}

export const useDatePickerStore = create<DatePickerStore>((set, get) => ({
  isOpen: false,
  currentSessionId: null,
  tempSelectedDate: null,
  /**
   * 날짜 Picker 열기
   * 이미 열려있는 동일한 세션의 경우 닫기
   * @param sessionId 세션 ID
   */
  openPicker: (sessionId) => {
    const state = get();
    // 같은 session이고 이미 열려있으면 닫기
    if (state.isOpen && state.currentSessionId === sessionId) {
      set({ isOpen: false, currentSessionId: null, tempSelectedDate: null });
    } else {
      set({ isOpen: true, currentSessionId: sessionId, tempSelectedDate: null });
    }
  },
  /**
   * 날짜 Picker 닫기
   */
  closePicker: () => {
    set({ isOpen: false, currentSessionId: null, tempSelectedDate: null });
  },
  /**
   * 임시 선택 날짜 설정
   * @param date 
   */
  setTempDate: (date) => {
    set({ tempSelectedDate: date });
  },
  /**
   * 선택 날짜 확정
   * 선택 완료 버튼을 통해 호출
   */
  confirmDate: () => {
    // DatePicker 컴포넌트에서 updateSession 호출 후 이 함수를 호출
    set({ isOpen: false, currentSessionId: null, tempSelectedDate: null });
  },
}));

