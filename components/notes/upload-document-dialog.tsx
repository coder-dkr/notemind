'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import { Cloud, Loader2 } from 'lucide-react';
import * as mammoth from 'mammoth';
import { Buffer } from 'buffer';
import pdfParse from 'pdf-parse';


interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (content: string) => void;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onUpload,
}: UploadDocumentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsLoading(true);
    setError(null);
    
    try {
      let content = '';
      
      if (file.name.endsWith('.docx')) {
        content = await extractTextFromDocx(file);
      } else if (file.name.endsWith('.pdf')) {
        content = await extractTextFromPdf(file);
      } else {
        setError('Unsupported file format. Please upload a .docx or .pdf file.');
        return;
      }
      
      onUpload(content);
    } catch (err) {
      console.error('Error extracting text:', err);
      setError('Failed to extract text from the document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {


const parsePDF = async (arrayBuffer: ArrayBuffer) => {
  const pdfData = Buffer.from(arrayBuffer);
  const result = await pdfParse(pdfData);
  return result.text;
};
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          // const pdfData = new Uint8Array(arrayBuffer);
          const resultss = await parsePDF(arrayBuffer)
          resolve(resultss);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a DOCX or PDF file to import its content into your note.
          </DialogDescription>
        </DialogHeader>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          } ${isLoading ? 'bg-muted/50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <>
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Processing document...
              </p>
            </>
          ) : (
            <>
              <Cloud className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center mb-1">
                Drag and drop your document here, or click to select a file
              </p>
              <p className="text-xs text-muted-foreground/70 text-center">
                (Supports: DOCX, PDF)
              </p>
            </>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}