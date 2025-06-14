
// Web Crypto API utilities for end-to-end encryption

export const generateKey = async (): Promise<Uint8Array> => {
  const key = crypto.getRandomValues(new Uint8Array(32)); // 256-bit key
  return key;
};

export const generateIV = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
};

export const encryptFile = async (file: File): Promise<{
  encryptedData: ArrayBuffer;
  key: Uint8Array;
  iv: Uint8Array;
}> => {
  // Generate encryption key and IV
  const key = await generateKey();
  const iv = generateIV();
  
  // Read file as ArrayBuffer
  const fileData = await file.arrayBuffer();
  
  // Import key for Web Crypto API
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  // Encrypt the file data
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    cryptoKey,
    fileData
  );
  
  return {
    encryptedData,
    key,
    iv
  };
};

export const decryptFile = async (
  encryptedData: ArrayBuffer,
  key: Uint8Array,
  iv: Uint8Array
): Promise<Blob> => {
  // Import key for Web Crypto API
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    cryptoKey,
    encryptedData
  );
  
  // Return as Blob
  return new Blob([decryptedData]);
};
