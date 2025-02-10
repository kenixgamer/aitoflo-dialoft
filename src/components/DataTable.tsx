import { ReactNode } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { DeleteIconMd } from "@/utils/icons/icons";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import DatatableSkeleton from "@/skeleton/DatatableSkeleton";
import { AlertCircle } from 'lucide-react';

interface Column {
  header: string;
  accessor: string;
  align?: "left" | "right";
}

interface DataTableProps {
  columns: Column[];
  data: any;
  isLoading: boolean;
  isError: boolean;
  handleNavigateOfColumn?: (item: any) => void;
  onDelete?: (item: any) => void;
  actions?: (item: any) => ReactNode;
  deleteDialogProps?: {
    title: string;
    description: string;
  };
  errorMessage: string;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const DataTable = ({ 
  columns, 
  data,
  onDelete,
  actions,
  deleteDialogProps = {
    title: "Delete Item",
    description: "Are you sure you want to delete this item? This action cannot be undone."
  },
  handleNavigateOfColumn,
  isLoading,
  isError,
  errorMessage,
  totalPages,
  currentPage,
  onPageChange
}: DataTableProps) => {

  if(isError) return (
    <div className="flex items-center justify-center mt-10 gap-4">
      <AlertCircle className="h-12 w-12 text-purple-500" />
      <div className="text-3xl bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
        {errorMessage}
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-black text-white p-4">
      {isLoading ? (
        <DatatableSkeleton />
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              {columns && columns.map((column, index) => (
                <th 
                  key={index}
                  className={`p-2 text-${column.align || 'left'} text-zinc-300 font-bold text-[16px]`}
                >
                  {column.header}
                </th>
              ))}
              {(onDelete || actions) && <th className="w-10"></th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item :any, index : number) => (
              <tr 
                onClick={() => handleNavigateOfColumn?.(item._id)} 
                key={index} 
                className="border-b border-zinc-800 hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`p-2 text-base ${column.align === 'right' ? 'text-right' : ''} ${
                      colIndex === 0 ? 'font-medium whitespace-nowrap text-zinc-300' : 'text-zinc-400'
                    }`}
                  >
                    {typeof item[column.accessor] === 'object' 
                      ? item[column.accessor]?.toString().slice(0, 10)
                      : item[column.accessor]
                    } 
                  </td>
                ))}
                {(onDelete || actions) && (
                  <td onClick={(e) => e.stopPropagation()} className="flex items-center justify-end p-2">
                    {actions?.(item)}
                    {onDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <DeleteIconMd />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black border-zinc-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">{deleteDialogProps.title}</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-400">
                              {deleteDialogProps.description}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDelete(item._id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-4">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                  className={`cursor-pointer text-white bg-zinc-900 border-zinc-800 hover:bg-zinc-800 ${
                    currentPage === 1 ? 'opacity-50 pointer-events-none' : ''
                  }`}
                />
              </PaginationItem>
              
              {(() => {
              const visiblePages = [];
              const maxVisiblePages = 7;
              
              if (totalPages <= maxVisiblePages) {
                // Show all pages if total is less than maxVisiblePages
                for (let i = 1; i <= totalPages; i++) {
                  visiblePages.push(i);
                }
              } else {
                // Always show first page
                visiblePages.push(1);
                
                if (currentPage > 3) {
                  visiblePages.push('...');
                }
                
                // Show pages around current page
                for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
                  visiblePages.push(i);
                }
                
                if (currentPage < totalPages - 2) {
                  visiblePages.push('...');
                }
                
                // Always show last page
                visiblePages.push(totalPages);
              }

              return visiblePages.map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <span className="px-4 py-2">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => onPageChange(page as number)}
                      className={`cursor-pointer ${currentPage === page ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ));
            })()}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                  className={`cursor-pointer text-white bg-zinc-900 border-zinc-800 hover:bg-zinc-800 ${
                    currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default DataTable;