/**
 * 이미지 파일 유효성 검증 결과
 */
export interface ImageValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * 이미지 파일 유효성 검증 함수
 * @param file - 검증할 파일
 * @param maxSize - 최대 파일 크기 (bytes), 기본값 15MB
 * @returns 검증 결과 객체
 */
export function validateImageFile(
  file: File,
  maxSize: number = 15 * 1024 * 1024
): ImageValidationResult {
  // 용량 체크
  if (file.size > maxSize) {
    return {
      isValid: false,
      errorMessage: "이미지 용량은 15MB를 초과할 수 없습니다.",
    };
  }

  // 이미지 파일 타입 체크 (.jpg(.jpeg)와 .png만 허용)
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const fileName = file.name.toLowerCase();

  const isValidMimeType = allowedMimeTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!isValidMimeType || !hasValidExtension) {
    return {
      isValid: false,
      errorMessage: "JPG 또는 PNG 파일만 업로드 가능합니다.",
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}

/**
 * FileReader를 사용하여 파일을 Data URL로 변환하는 함수
 * @param file - 변환할 파일
 * @returns Data URL 문자열을 포함한 Promise
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error("파일 읽기 중 오류가 발생했습니다."));
    };
    reader.readAsDataURL(file);
  });
}

