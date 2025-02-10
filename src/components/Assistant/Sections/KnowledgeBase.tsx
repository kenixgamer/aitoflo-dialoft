import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import KnowledgeBaseSection from "../AssistanUpdateForm/KnowledgeBaseSection";

const KnowledgeBase = ({formData, setFormData, workshopId, assistantId, assistant} : any) => {
  return (
    <TabsContent value="knowledgebase">
      <Card className="bg-black border-zinc-800">
        <CardContent className="space-y-6 pt-6">
          <KnowledgeBaseSection
            workshopId={workshopId || ""}
            assistantId={assistantId || ""}
            initialKnowledgebaseIds={assistant?.knowledgebaseIds}
            formData={formData}
            setFormData={setFormData}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default KnowledgeBase;
