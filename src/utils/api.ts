// API utilities for file upload/download
// Replace BASE_URL with our Render deployment URL

const BASE_URL = 'https://my-secureshare-backend.onrender.com'; // 👈 This now points to your live backend

export const uploadFile = async (
  encryptedData: ArrayBuffer,
  originalFileName: string,
  mimeType: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    
    // Convert ArrayBuffer to Blob
    const blob = new Blob([encryptedData]);
    formData.append('file', blob, `encrypted_${originalFileName}`);
    formData.append('originalName', originalFileName);
    formData.append('mimeType', mimeType);
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.fileId);
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };
    
    xhr.onerror = () => {
      reject(new Error('Network error during upload'));
    };
    
    xhr.open('POST', `${BASE_URL}/api/upload`);
    xhr.send(formData);
  });
};

export const downloadFile = async (
  fileId: string,
  onProgress?: (progress: number) => void
): Promise<{ data: ArrayBuffer; filename: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    
    xhr.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const filename = xhr.getResponseHeader('X-Original-Filename') || 'download';
        const mimeType = xhr.getResponseHeader('X-Original-Mimetype') || 'application/octet-stream';
        resolve({
          data: xhr.response,
          filename: filename,
          mimeType: mimeType
        });
      } else if (xhr.status === 404) {
        reject(new Error('File not found or has expired'));
      } else {
        reject(new Error(`Download failed: ${xhr.statusText}`));
      }
    };
    
    xhr.onerror = () => {
      reject(new Error('Network error during download'));
    };
    
    xhr.open('GET', `${BASE_URL}/api/download/${fileId}`);
    xhr.send();
  });
};
