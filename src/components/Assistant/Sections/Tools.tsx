import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import CalendarTool from '../Tools/CalendarTool';

const Tools = ({formData, handleRemoveCalendarFunction, setSelectedFunction, setShowFunctionDialog} : any) => {
  return (
    <TabsContent value="tools">
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <Label className="text-gray-200">Calendar Integration</Label>
            <CalendarTool 
              formData={formData}
              handleRemoveCalendarFunction={handleRemoveCalendarFunction}
              setSelectedFunction={setSelectedFunction}
              setShowFunctionDialog={setShowFunctionDialog}
            />
          </div>
          {/* Add other tools here */}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Tools;
