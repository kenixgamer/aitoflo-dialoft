import { Skeleton } from "@/components/ui/skeleton";
const KnowledgeBaseSkeleton = () => {
  return (
    <div className="mt-4">
      {/* Left Sidebar Skeleton */}
      <div className="flex h-screen">
        <div className="w-[300px] h-full">
          <div className="flex-col rounded-md mt-4 bg-black border border-zinc-800 p-6 h-[calc(100vh-2rem)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-6 bg-zinc-800" />
                <Skeleton className="h-6 w-32 bg-zinc-800" />
              </div>
              <Skeleton className="h-8 w-8 bg-zinc-800 rounded-lg" />
            </div>
            
            <div className="h-[1px] w-full bg-zinc-800 mb-4" />

            <div className="space-y-3 h-full overflow-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 bg-zinc-800" />
                  <Skeleton className="h-5 w-40 bg-zinc-800" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="ml-2 flex-1 h-full">
          <div className="flex flex-col rounded-md bg-black border border-zinc-800 p-6 h-[calc(100vh-2rem)] mt-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-48 bg-zinc-800" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32 bg-zinc-800" />
                  <div className="flex items-center ml-4">
                    <Skeleton className="h-4 w-4 bg-zinc-800 rounded-full" />
                    <Skeleton className="h-4 w-24 bg-zinc-800 ml-2" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-9 w-10 bg-zinc-800" />
            </div>
            
            <div className="h-[1px] w-full bg-zinc-800 mb-8" />

            <div className="space-y-4 h-full overflow-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-md transition-colors">
                  <Skeleton className="h-8 w-8 bg-zinc-800" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-48 bg-zinc-800" />
                    <Skeleton className="h-3 w-24 bg-zinc-800" />
                  </div>
                  <Skeleton className="h-6 w-6 bg-zinc-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseSkeleton;