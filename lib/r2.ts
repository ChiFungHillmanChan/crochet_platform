import { apiPost } from "@/lib/api";

interface UploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
}

interface UploadOptions {
  productSlug?: string;
  mediaType?: "images" | "videos";
}

export async function getUploadUrl(
  filename: string,
  contentType: string,
  options?: UploadOptions
): Promise<UploadUrlResponse> {
  return apiPost<UploadUrlResponse>("get-upload-url", {
    filename,
    contentType,
    productSlug: options?.productSlug,
    mediaType: options?.mediaType,
  });
}

export async function uploadToR2(
  file: File,
  onProgress?: (percent: number) => void,
  options?: UploadOptions
): Promise<string> {
  const { uploadUrl, publicUrl } = await getUploadUrl(file.name, file.type, options);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(file);
  });

  return publicUrl;
}
