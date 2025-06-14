
import { useState } from 'react';
import { UploadArea } from '@/components/UploadArea';
import { UploadProgress } from '@/components/UploadProgress';
import { ShareLink } from '@/components/ShareLink';
import { FileIcon, Shield, Clock } from 'lucide-react';

const Index = () => {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'completed'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const handleUploadStart = (file: File) => {
    setFileName(file.name);
    setUploadState('uploading');
    setUploadProgress(0);
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const handleUploadComplete = (url: string) => {
    setShareUrl(url);
    setUploadState('completed');
  };

  const handleReset = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setShareUrl('');
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">SecureShare</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share files securely with end-to-end encryption. Your files are encrypted in your browser before upload.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {uploadState === 'idle' && (
            <UploadArea 
              onUploadStart={handleUploadStart}
              onUploadProgress={handleUploadProgress}
              onUploadComplete={handleUploadComplete}
            />
          )}

          {uploadState === 'uploading' && (
            <UploadProgress 
              fileName={fileName}
              progress={uploadProgress}
            />
          )}

          {uploadState === 'completed' && (
            <ShareLink 
              url={shareUrl}
              fileName={fileName}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">End-to-End Encrypted</h3>
            <p className="text-gray-600">Files are encrypted in your browser before upload. We never see your data.</p>
          </div>
          <div className="text-center p-6">
            <FileIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Up to 2GB Files</h3>
            <p className="text-gray-600">Share large files, documents, images, and videos securely.</p>
          </div>
          <div className="text-center p-6">
            <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Auto-Expires</h3>
            <p className="text-gray-600">Files are automatically deleted after 7 days for security.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
