import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useGetDocuments, useDeleteDocument, useAddDocument } from "@/query/knowledgebase.queries";
import { useDebounce } from "@/hooks/useDebounce";
import DataTable from "../DataTable";
import SearchHeader from "../SearchHeader";
import { FileTextIcon, UploadIcon, CloseIcon, BookIcon } from "@/utils/icons/icons";
import { Button } from "../ui/button";
import { formatBytes } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useDropzone } from "react-dropzone";
import { uploadFilesToVapi } from "@/service/knowledgebase.services";
import { getTimezone } from "@/utils/helperFunctions";
import Spinner from "../Spinner";

const Knowledgebase = () => {
  const { workshopId } = useParams();
  const timezone = getTimezone();
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);

  if (!workshopId) return null;

  const { data: documentsData, isLoading, isError } = useGetDocuments(
    workshopId, 
    debouncedSearch,
    currentPage,
    12,
    timezone
  );
  const { mutate: deleteDocument } = useDeleteDocument(workshopId);
  const { mutateAsync: addDocument } = useAddDocument();
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const docIds = await uploadFilesToVapi(files);
      await addDocument({ workShopId: workshopId, files : docIds });
      setIsUploadDialogOpen(false);
      setFiles([]);
    } catch (error) {
    }finally{
      setIsUploading(false);
    }
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const columns = [
    {
      header: "Document Name",
      accessor: "fileName",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <FileTextIcon />
          {row.fileName}
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      cell: (row: any) => row.type.toUpperCase(),
    },
    {
      header: "Size",
      accessor: "fileSize",
      cell: (row: any) => formatBytes(row.fileSize),
    },
    { header: "Created Time", accessor: "createdAt", align: "right" as const },
  ];

  const handleDeleteDocument = async(docId :string) => {
    await deleteDocument(docId);
  }
  return (
    <div className="flex h-full flex-col bg-black text-white">
      <SearchHeader
      buttonDisabled={isUploading}
        headerIcon={<BookIcon />}
        headerText="Documents"
        buttonText={isUploading ? <>Uploading <Spinner/></> : "Upload Documents"}
        onButtonClick={() => setIsUploadDialogOpen(true)}
        textValue={searchTerm}
        setTextValue={handleSearch}
      />

      <DataTable
      onDelete={(id) => handleDeleteDocument(id)}
        isLoading={isLoading}
        isError={isError}
        errorMessage="No documents found"
        columns={columns}
        data={documentsData?.data || []}
        totalPages={documentsData?.totalPages || 1}
        currentPage={documentsData?.currentPage || 1}
        onPageChange={setCurrentPage}
        handleNavigateOfColumn={() => {}}
        deleteDialogProps={{
          title: "Delete File",
          description:
            "Are you sure you want to delete this File? This action cannot be undone.",
        }}
      />

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[525px] bg-black border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Documents</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragActive 
                  ? "border-purple-600 bg-purple-600/10" 
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <input {...getInputProps()} />
              <span className="flex items-center justify-center mb-4">
              <UploadIcon />
              </span>
              <p className="text-gray-300">
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag & drop files here, or click to select"}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Supported formats: PDF, TXT, DOC, DOCX
              </p>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-zinc-900 p-2 rounded border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <FileTextIcon />
                      <span className="text-sm text-gray-200">{file.name}</span>
                      <span className="text-xs text-gray-400">({formatBytes(file.size)})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <CloseIcon />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="normal"
              onClick={() => {
                setIsUploadDialogOpen(false);
                setFiles([]);
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
            variant="primary"
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
              className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
            >
              {isUploading ? <>Uploading <Spinner/></> : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Knowledgebase;
