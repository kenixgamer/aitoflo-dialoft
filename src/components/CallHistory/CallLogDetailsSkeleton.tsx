import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CallLogDetailsSkeleton = () => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-20 bg-zinc-800 mb-2" />
            <Skeleton className="h-5 w-32 bg-zinc-800" />
          </div>
        ))}
      </div>

      <Tabs defaultValue="conversation" className="w-full">
        <TabsList className="bg-zinc-900">
          <TabsTrigger value="conversation" className="text-zinc-400">
            Conversation
          </TabsTrigger>
          <TabsTrigger value="cost" className="text-zinc-400">
            Cost Breakdown
          </TabsTrigger>
          <TabsTrigger value="recording" className="text-zinc-400">
            Recording
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversation" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-md border border-zinc-800">
              {[1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-16 bg-zinc-800 mb-2" />
                  <Skeleton className="h-5 w-24 bg-zinc-800" />
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 p-4 rounded-md border border-zinc-800">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-4 w-12 bg-zinc-800" />
                    <Skeleton className="h-4 w-16 bg-zinc-800" />
                    <Skeleton className="h-4 flex-1 bg-zinc-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CallLogDetailsSkeleton;