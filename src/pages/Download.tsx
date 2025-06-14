import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Download, FileIcon, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { downloadFile } from '@/utils/api';
import { decryptFile } from '@/utils/encryption';
import { useToast } from '@/hooks/use-toast';

const DownloadPage = () => {
  const { fileId } = useParams();
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'decrypting' | 'ready' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [decryptedBlob, setDecryptedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const getEncryptionParams = () => {
    const hash = window.location.hash; // e.g., #/download/some-id?key=...&iv=...
    const searchPart = hash.split('?')[1] || '';
    const params = new URLSearchParams(searchPart);
    const keyHex = params.get('key');
    const ivHex = params.get('iv');
    
    if (!keyHex || !ivHex) {
      throw new Error('Encryption key not found in URL');
    }
    
    const key = new Uint8Array(keyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
    return { key, iv };
  };

  const handleDownload = async () => {
    if (!fileId) return;
    
    try {
      setDownloadState('downloading');
      setProgress(0);
      
      // Get encryption parameters from URL
      const { key, iv } = getEncryptionParams();
      
      // Download encrypted file
      const { data, filename, mimeType } = await downloadFile(fileId, (progress) => {
        setProgress(progress * 0.7); // 0% to 70%
      });
      
      setFileName(filename);
      setDownloadState('decrypting');
      setProgress(75);
      
      // Decrypt file
      const decrypted = await decryptFile(data, key, iv, mimeType);
      setProgress(95);
      
      setDecryptedBlob(decrypted);
      setDownloadState('ready');
      setProgress(100);
      
    } catch (error) {
      console.error('Download failed:', error);
      setError(error instanceof Error ? error.message : 'Download failed');
      setDownloadState('error');
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive"
      });
    }
  };

  const saveFile = () => {
    if (!decryptedBlob || !fileName) return;
    
    const url = URL.createObjectURL(decryptedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File saved!",
      description: `${fileName} has been downloaded to your device`
    });
  };

  useEffect(() => {
    // Check if encryption parameters exist
    try {
      getEncryptionParams();
    } catch (error) {
      setError('Invalid download link - encryption key missing');
      setDownloadState('error');
    }
  }, []);

  const getProgressText = () => {
    switch (downloadState) {
      case 'downloading': return 'Downloading encrypted file...';
      case 'decrypting': return 'Decrypting file in browser...';
      case 'ready': return 'File ready for download!';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">SecureShare Download</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            {downloadState === 'idle' && (
              <>
                <FileIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Ready to Download</h3>
                <p className="text-gray-600 mb-6">
                  This file will be decrypted in your browser for security.
                </p>
                <Button onClick={handleDownload} size="lg" className="mb-4">
                  <Download className="h-5 w-5 mr-2" />
                  Start Download
                </Button>
                <div className="flex items-center justify-center text-sm text-blue-600">
                  <Shield className="h-4 w-4 mr-1" />
                  End-to-end encrypted
                </div>
              </>
            )}

            {(downloadState === 'downloading' || downloadState === 'decrypting') && (
              <>
                <div className="flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-blue-600 mr-2" />
                  <FileIcon className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Processing File</h3>
                {fileName && (
                  <p className="text-gray-600 mb-6">{fileName}</p>
                )}
                <div className="max-w-md mx-auto mb-4">
                  <Progress value={progress} className="h-3" />
                </div>
                <p className="text-sm text-gray-500">
                  {getProgressText()} ({Math.round(progress)}%)
                </p>
              </>
            )}

            {downloadState === 'ready' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-green-700">File Ready!</h3>
                <p className="text-gray-600 mb-6">
                  <span className="font-medium">{fileName}</span> has been decrypted successfully.
                </p>
                <Button onClick={saveFile} size="lg" className="mb-4">
                  <Download className="h-5 w-5 mr-2" />
                  Save to Device
                </Button>
                <p className="text-sm text-gray-500">
                  File decrypted locally in your browser
                </p>
              </>
            )}

            {downloadState === 'error' && (
              <>
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-red-700">Download Failed</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={handleDownload} variant="outline">
                  Try Again
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
