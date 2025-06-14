
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Copy, Download, RotateCcw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareLinkProps {
  url: string;
  fileName: string;
  onReset: () => void;
}

export const ShareLink = ({ url, fileName, onReset }: ShareLinkProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The download link has been copied to your clipboard"
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-8 text-center">
      <div className="flex items-center justify-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      
      <h3 className="text-2xl font-bold mb-2 text-green-700">File Uploaded Successfully!</h3>
      <p className="text-gray-600 mb-6">
        Your file <span className="font-medium">{fileName}</span> has been encrypted and uploaded securely.
      </p>
      
      <div className="max-w-2xl mx-auto mb-6">
        <label className="block text-sm font-medium mb-2 text-left">
          Shareable Link (includes decryption key)
        </label>
        <div className="flex gap-2">
          <Input 
            value={url} 
            readOnly 
            className="font-mono text-sm"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button 
            onClick={copyToClipboard}
            variant={copied ? "default" : "outline"}
            className="shrink-0"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
        <Button 
          onClick={() => window.open(url, '_blank')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Test Download
        </Button>
        <Button 
          onClick={copyToClipboard}
          variant="outline"
          className="flex items-center gap-2"
        >
          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
        <Button 
          onClick={onReset}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Upload Another
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
        <p className="text-yellow-800">
          <strong>Important:</strong> This link contains the decryption key. 
          Anyone with this link can download and decrypt your file. 
          The file will be automatically deleted after 7 days.
        </p>
      </div>
    </Card>
  );
};
