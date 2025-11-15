"use client";

import { useToastStore } from "../../store/toastStore";

export default function Toast() {
  const { message } = useToastStore();

  if (!message) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 flex justify-center z-50 pointer-events-none px-4 md:px-0">
      <div className="bg-[#323232] text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in pointer-events-auto w-full md:w-130">
        <p className="text-md md:text-base md:whitespace-nowrap text-center">{message}</p>
      </div>
    </div>
  );
}

