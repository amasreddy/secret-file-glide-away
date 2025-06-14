
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, File, AlertCircle } from 'lucide-react';
import { encryptFile } from '@/utils/encryption';
import { uploadFile } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface UploadAreaProps {
  onUploadStart: (file: File) => void;
  onUploadProgress: (progress: number) => void;
  onUploadComplete: (url: string) => void;
}

export const UploadArea = ({ onUploadStart, onUploadProgress, onUploadComplete }: UploadAreaProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 2GB",
        variant: "destructive"
      });
      return;
    }

    try {
      onUploadStart(file);
      
      // Encrypt file
      onUploadProgress(10);
      const { encryptedData, key, iv } = await encryptFile(file);
      
      onUploadProgress(30);
      
      // Upload encrypted file
      const fileId = await uploadFile(encryptedData, file.name, (progress) => {
        onUploadProgress(30 + (progress * 0.6)); // 30% to 90%
      });
      
      onUploadProgress(95);
      
      // Generate share URL with encryption key
      const keyString = Array.from(key).map(b => b.toString(16).padStart(2, '0')).join('');
      const ivString = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
      const shareUrl = `${window.location.origin}/download/${fileId}#key=${keyString}&iv=${ivString}`;
      
      onUploadProgress(100);
      onUploadComplete(shareUrl);
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <Card className="p-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
        </h3>
        <p className="text-gray-600 mb-4">
          or click to browse your files
        </p>
        <Button variant="outline" className="mb-4">
          <File className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <AlertCircle className="h-4 w-4 mr-1" />
          Maximum file size: 2GB
        </div>
      </div>
    </Card>
  );
};
