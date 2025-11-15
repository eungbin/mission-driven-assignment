import { create } from "zustand";

interface CategoryStore {
  // 최종 저장된 카테고리 선택 상태
  selectedCategories: string[];
  // 카테고리 페이지에서 임시로 선택 중인 상태
  tempSelectedCategories: string[];
  
  // 최종 선택 상태 업데이트
  setSelectedCategories: (categories: string[]) => void;
  // 임시 선택 상태 업데이트
  setTempSelectedCategories: (categories: string[]) => void;
  // 임시 상태를 최종 상태로 초기화
  resetTempToSelected: () => void;
  // 임시 상태를 최종 상태로 적용
  applyTempToSelected: () => void;
  // 임시 상태를 최종 상태로 되돌림
  revertTempToSelected: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategories: [],
  tempSelectedCategories: [],
  
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setTempSelectedCategories: (categories) => set({ tempSelectedCategories: categories }),
  
  resetTempToSelected: () => set((state) => ({ 
    tempSelectedCategories: [...state.selectedCategories] 
  })),
  
  applyTempToSelected: () => set((state) => ({ 
    selectedCategories: [...state.tempSelectedCategories] 
  })),
  
  revertTempToSelected: () => set((state) => ({ 
    tempSelectedCategories: [...state.selectedCategories] 
  })),
}));

