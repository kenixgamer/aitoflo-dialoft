// import { useState } from 'react';
// import { Button } from "../ui/button";
// import { useGoHighLevelSheets, useGoHighLevelContacts } from "@/query/gohighlevel.queries";
// import { Loader2 } from "lucide-react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

// interface GoHighLevelImportProps {
//   onContactsSelect: (contacts: Array<{ name: string; phoneNumber: string }>) => void;
// }

// const GoHighLevelImport = ({ onContactsSelect }: GoHighLevelImportProps) => {
//   const [selectedSheetId, setSelectedSheetId] = useState<string>("");
//   const { data: sheets, isLoading: isSheetsLoading } = useGoHighLevelSheets();
//   const { data: contacts, isLoading: isContactsLoading } = useGoHighLevelContacts(selectedSheetId);

//   const handleSheetSelect = async (sheetId: string) => {
//     setSelectedSheetId(sheetId);
//   };

//   const handleImportContacts = () => {
//     if (!contacts) return;
//     const formattedContacts = contacts.map(contact => ({
//       name: contact.name || '',
//       phoneNumber: contact.phone || ''
//     }));
//     onContactsSelect(formattedContacts);
//   };

//   if (isSheetsLoading) {
//     return <div className="flex items-center justify-center p-4">
//       <Loader2 className="w-6 h-6 animate-spin" />
//     </div>;
//   }

//   return (
//     <div className="space-y-4">
//       {!selectedSheetId ? (
//         <div className="space-y-4">
//           <h3 className="text-lg font-medium">Select a Sheet</h3>
//           <div className="grid gap-2">
//             {sheets?.map((sheet) => (
//               <Button
//                 key={sheet.id}
//                 variant="outline"
//                 className="w-full justify-start text-left"
//                 onClick={() => handleSheetSelect(sheet.id)}
//               >
//                 {sheet.name}
//               </Button>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {isContactsLoading ? (
//             <Loader2 className="w-6 h-6 animate-spin" />
//           ) : (
//             <>
//               <Button onClick={() => setSelectedSheetId("")} variant="outline">
//                 Back to Sheets
//               </Button>
              
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Phone</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {contacts?.map((contact) => (
//                     <TableRow key={contact.id}>
//                       <TableCell>{contact.name}</TableCell>
//                       <TableCell>{contact.phone}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               <Button 
//                 onClick={handleImportContacts}
//                 className="w-full"
//               >
//                 Import Contacts
//               </Button>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GoHighLevelImport;
