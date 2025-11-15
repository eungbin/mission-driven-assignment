import { create } from "zustand";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface FormStore {
  // 대표 이미지
  representativeImage: {
    file: File | null;
    preview: string | null;
  };
  setRepresentativeImage: (file: File | null, preview: string | null) => void;

  // 추가 이미지
  additionalImages: ImageItem[];
  setAdditionalImages: (images: ImageItem[]) => void;
  addAdditionalImage: (image: ImageItem) => void;
  removeAdditionalImage: (id: string) => void;
  replaceAdditionalImage: (id: string, image: ImageItem) => void;

  // 콘텐츠 제목
  contentTitle: string;
  setContentTitle: (title: string) => void;

  // 활동 방식 선택
  activityType: "online" | "offline" | null;
  setActivityType: (type: "online" | "offline" | null) => void;

  // 회차 정보
  sessions: Array<{
    id: string;
    date: string;
    startTime: { hour: string; minute: string; period: "오전" | "오후" };
    endTime: { hour: string; minute: string; period: "오전" | "오후" };
    content: string;
  }>;
  addSession: () => void;
  removeSession: (id: string) => void;
  updateSession: (
    id: string,
    data: {
      date?: string;
      startTime?: { hour: string; minute: string; period: "오전" | "오후" };
      endTime?: { hour: string; minute: string; period: "오전" | "오후" };
      content?: string;
    }
  ) => void;

  // 폼 초기화
  resetForm: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  // 대표 이미지
  representativeImage: {
    file: null,
    preview: null,
  },
  setRepresentativeImage: (file, preview) =>
    set({ representativeImage: { file, preview } }),

  // 추가 이미지
  additionalImages: [],
  setAdditionalImages: (images) => set({ additionalImages: images }),
  addAdditionalImage: (image) =>
    set((state) => ({
      additionalImages: [image, ...state.additionalImages],
    })),
  removeAdditionalImage: (id) =>
    set((state) => ({
      additionalImages: state.additionalImages.filter((img) => img.id !== id),
    })),
  replaceAdditionalImage: (id, image) =>
    set((state) => ({
      additionalImages: state.additionalImages.map((img) =>
        img.id === id ? image : img
      ),
    })),

  // 콘텐츠 제목
  contentTitle: "",
  setContentTitle: (title) => set({ contentTitle: title }),

  // 활동 방식 선택
  activityType: null,
  setActivityType: (type) => set({ activityType: type }),

  // 회차 정보
  sessions: [
    {
      id: "session-1",
      date: "",
      startTime: { hour: "10", minute: "00", period: "오전" },
      endTime: { hour: "11", minute: "00", period: "오전" },
      content: "",
    },
  ],
  addSession: () =>
    set((state) => ({
      sessions: [
        ...state.sessions,
        {
          id: `session-${Date.now()}-${Math.random()}`,
          date: "",
          startTime: { hour: "10", minute: "00", period: "오전" },
          endTime: { hour: "11", minute: "00", period: "오전" },
          content: "",
        },
      ],
    })),
  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((session) => session.id !== id),
    })),
  updateSession: (id, data) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? { ...session, ...data } : session
      ),
    })),

  // 폼 초기화
  resetForm: () =>
    set({
      representativeImage: { file: null, preview: null },
      additionalImages: [],
      contentTitle: "",
      activityType: null,
      sessions: [
        {
          id: "session-1",
          date: "",
          startTime: { hour: "10", minute: "00", period: "오전" },
          endTime: { hour: "11", minute: "00", period: "오전" },
          content: "",
        },
      ],
    }),
}));

