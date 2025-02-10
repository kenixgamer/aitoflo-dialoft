export interface Call {
  _id: string;
  callId: string;
  callDuration: string;
  type: 'web_call' | 'batch_call';
  cost: number;
  disconnectionReason: string;
  callStatus: string;
  from: string;
  to: string;
  callCreatedAt: Date;
  webCallUrl: string;
}

export interface ICallHistoryFilters {
  fromDate?: Date;
  toDate?: Date;
  searchTerm?: string;
  sortBy?: 'latest' | 'oldest' | 'price_high' | 'price_low';
}

export interface ColumnVisibility {
  [key: string]: boolean;
}

export type NumberSource = 'manual' | 'csv' | 'gohighlevel';

export interface GoHighLevelSheet {
  id: string;
  name: string;
  totalContacts: number;
  lastUpdated: Date;
}

export interface BatchCallRecipient {
  phoneNumber: string;
  dynamicValues?: Record<string, string>;
}

export interface BatchCallData {
  name: string;
  assistantId: string;
  phoneNumberId: string;
  maxConcurrentCalls: number;
  scheduleTime?: string;
  recipients?: BatchCallRecipient[];
  numberSource: NumberSource;
  sheetId?: string;
  workshopId: string;
  timezone: string;
  csvHeaders?: string[];
}
