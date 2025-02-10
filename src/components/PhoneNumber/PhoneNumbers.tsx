import { Button } from "@/components/ui/button";
import { PhoneIconSmall, CancelIcon, PhoneHeaderIcon } from "@/utils/icons/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  useAddTwilioPhoneNumber,
  useAddVonagePhoneNumber,
  useDeletePhoneNumber,
  useGetPhoneNumbers,
} from "@/query/phoneNumber.queries";
import SearchHeader from "../SearchHeader";
import DataTable from "../DataTable";
import { getTimezone } from "@/utils/helperFunctions";
import { useDebounce } from "@/hooks/useDebounce";

const PhoneNumbers = () => {
  const [twillioFormData, setTwillioFormData] = useState({
    number: "",
    twilioAccountSid: "",
    twilioAuthToken: "",
  });
  const [vonageFormData, setVonageFormData] = useState({
    number: "",
    credentialId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showAddNumber, setShowAddNumber] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const timezone  = getTimezone();
  const {
    data: phoneNumbers,
    isLoading,
    isError,
  } = useGetPhoneNumbers(currentPage, debouncedSearchTerm, 12, timezone);
  const { mutate: addTwillioPhoneNumber, isPending : isAddingTwillioNumber } = useAddTwilioPhoneNumber();
  const { mutate: addVonagePhoneNumber, isPending : isAddingVonageNumber } = useAddVonagePhoneNumber();
  const { mutate: deletePhoneNumber } = useDeletePhoneNumber();
  const columns = [
    { header: "Telephony Provider", accessor: "provider" },
    { header: "Mobile Number", accessor: "number" },
    { header: "Created At", accessor: "createdAt", align: "right" as const },
  ];
  const handleAddTwillioPhoneNumber = () => {
    addTwillioPhoneNumber(twillioFormData);
    setShowAddNumber(false);
  };
  const handleAddVonagePhoneNumber = () => {
    addVonagePhoneNumber(vonageFormData);
    setShowAddNumber(false);
  };
  const handleDelete = async (phoneNumber: any) => {
    deletePhoneNumber(phoneNumber);
  };
  return (
    <div className="w-full bg-black h-screen flex flex-col">
      <SearchHeader
      buttonDisabled={isAddingTwillioNumber || isAddingVonageNumber}
      headerIcon={<PhoneHeaderIcon />}
        textValue={searchTerm}
        setTextValue={setSearchTerm}
        buttonText="Add Mobile Number"
        buttonIcon={<PhoneIconSmall  />}
        onButtonClick={() => setShowAddNumber(true)}
        headerText="Mobile Numbers"
      />
      <DataTable
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        data={phoneNumbers?.phoneNumbers || []}
        onDelete={handleDelete}
        totalPages={phoneNumbers?.totalPages || 1}
        currentPage={currentPage}
         onPageChange={setCurrentPage}
        deleteDialogProps={{
          title: "Delete Phone Number",
          description:
            "Are you sure you want to delete this phone number? This action cannot be undone.",
        }}
        errorMessage="No Phone Numbers found"
      />
      {showAddNumber && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-[400px] mx-4">
            <div className="w-full flex justify-end mb-2">
              <CancelIcon
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                onClick={() => setShowAddNumber(false)}
              />
            </div>
            <Tabs
              defaultValue="account"
              className="bg-black border border-zinc-800 rounded-lg"
            >
              <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:text-white data-[state=active]:bg-zinc-800"
                >
                  Twillio
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="data-[state=active]:text-white data-[state=active]:bg-zinc-800"
                >
                  Vonage
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Card className="bg-black text-white border-none">
                  <CardHeader>
                    <CardTitle>Twillio</CardTitle>
                    <CardDescription className="text-gray-400">
                      Make changes to your phone number here. Click save when
                      you're done.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="number" className="text-gray-200">
                        Twillio Number
                      </Label>
                      <Input
                        id="number"
                        className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
                        defaultValue={twillioFormData.number}
                        onChange={(e) =>
                          setTwillioFormData({
                            ...twillioFormData,
                            number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="twilioAccountSid"
                        className="text-gray-200"
                      >
                        Twilio Account Sid
                      </Label>
                      <Input
                        id="twilioAccountSid"
                        className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
                        defaultValue={twillioFormData.twilioAccountSid}
                        onChange={(e) =>
                          setTwillioFormData({
                            ...twillioFormData,
                            twilioAccountSid: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="twilioAuthToken"
                        className="text-gray-200"
                      >
                        Twilio Auth Token
                      </Label>
                      <Input
                        id="twilioAuthToken"
                        className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
                        defaultValue={twillioFormData.twilioAuthToken}
                        onChange={(e) =>
                          setTwillioFormData({
                            ...twillioFormData,
                            twilioAuthToken: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="primary"
                      onClick={handleAddTwillioPhoneNumber}
                    >
                      Save changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card className="bg-black text-white border-none">
                  <CardHeader>
                    <CardTitle>Vonage</CardTitle>
                    <CardDescription className="text-gray-400">
                      Make changes to your phone number here. Click save when
                      you're done.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vonage-number" className="text-gray-200">
                        Number
                      </Label>
                      <Input
                        id="vonage-number"
                        className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
                        onChange={(e) =>
                          setVonageFormData({
                            ...vonageFormData,
                            number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="credentialId" className="text-gray-200">
                        Credential Id
                      </Label>
                      <Input
                        id="credentialId"
                        className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-700"
                        onChange={(e) =>
                          setVonageFormData({
                            ...vonageFormData,
                            credentialId: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="primary"
                      onClick={handleAddVonagePhoneNumber}
                    >
                      Save changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneNumbers;
