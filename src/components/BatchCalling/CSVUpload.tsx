import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';
import { DownloadIconAlt, UploadIconAlt } from "@/utils/icons/icons";

interface CSVUploadProps {
  onUpload: any;
}

// Remove the CSVRow interface as we'll handle dynamic headers

const CSVUpload = ({ onUpload }: CSVUploadProps) => {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            toast({
              title: "Error",
              description: `CSV parsing error: ${results.errors[0].message}`,
              variant: "destructive"
            });
            return;
          }

          const validRows = results.data.filter(row => {
            const phoneValid = (row as any).phoneNumber && 
              /^[+\d\s-]+$/.test((row as any).phoneNumber.trim());
            const nameValid = (row as any).name && (row as any).name.trim().length > 0;
            return phoneValid && nameValid;
          });

          if (validRows.length === 0) {
            toast({
              title: "Error",
              description: "No valid entries found in CSV. Please check the format.",
              variant: "destructive"
            });
            return;
          }

          // Format phone numbers and preserve all other fields
          const formattedData = validRows.map((row : any) => {
            const formattedRow = { ...row };
            formattedRow.name = formattedRow.name.trim();
            // Format phone number: remove spaces and ensure + prefix
            let phoneNumber = formattedRow.phoneNumber.trim().replace(/\s+/g, '');
            if (!phoneNumber.startsWith('+')) {
              phoneNumber = '+' + phoneNumber;
            }
            formattedRow.phoneNumber = phoneNumber;
            return formattedRow;
          });

          onUpload(formattedData);
          toast({
            title: "Success",
            variant: "success",
            description: `Successfully processed ${formattedData.length} entries`
          });
        },
        error: (error) => {
          toast({
            title: "Error",
            description: `Failed to read CSV file: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    }
  }, [onUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const downloadSample = () => {
    const csvContent = "name,phoneNumber\nJohn Doe,+1234567890\nJane Doe,+0987654321";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6 bg-black border-zinc-800">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-purple-600 bg-purple-600/10' 
            : 'border-zinc-800 hover:border-zinc-700'
        }`}
      >
        <input {...getInputProps()} />
        <UploadIconAlt />
        <p className="mt-2 text-sm text-zinc-400">
          {isDragActive
            ? "Drop the CSV file here"
            : "Drag and drop a CSV file here, or click to select"}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-zinc-400">
          CSV must include 'name' and 'phoneNumber' columns
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={downloadSample}
          className="flex items-center gap-2 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700"
        >
          <DownloadIconAlt  />
          Download Sample
        </Button>
      </div>
    </Card>
  );
};

export default CSVUpload;