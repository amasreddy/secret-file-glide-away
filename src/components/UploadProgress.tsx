
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Shield } from 'lucide-react';

interface UploadProgressProps {
  fileName: string;
  progress: number;
}

export const UploadProgress = ({ fileName, progress }: UploadProgressProps) => {
  const getProgressText = () => {
    if (progress < 30) return 'Encrypting file...';
    if (progress < 90) return 'Uploading encrypted file...';
    return 'Finalizing...';
  };

  return (
    <Card className="p-8 text-center">
      <div className="flex items-center justify-center mb-6">
        <Shield className="h-8 w-8 text-blue-600 mr-2" />
        <FileIcon className="h-8 w-8 text-gray-600" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Securing Your File</h3>
      <p className="text-gray-600 mb-6">
        Encrypting and uploading: <span className="font-medium">{fileName}</span>
      </p>
      
      <div className="max-w-md mx-auto mb-4">
        <Progress value={progress} className="h-3" />
      </div>
      
      <p className="text-sm text-gray-500">
        {getProgressText()} ({Math.round(progress)}%)
      </p>
    </Card>
  );
};
