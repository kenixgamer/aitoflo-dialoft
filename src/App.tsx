import { Routes, Route } from 'react-router-dom';
import DashboardSideBar from './pages/dashboard/DashboardSideBar.tsx';
import AssistantLists from './pages/dashboard/AssistantLists.tsx';
import Knowledgebase from './components/KnowledgeBase/Knowledgebase.tsx';
import BatchCall from "@/pages/dashboard/BatchCall.tsx";
// import AssistantDetails from './components/Assistant/AssistantDetails.tsx';
import PhoneNumbers from './components/PhoneNumber/PhoneNumbers.tsx';
import CallHistory from './components/CallHistory/CallHistory.tsx';
// import PricingPage from './pages/pricing/PricingPage.tsx';
import NotFound from './components/NotFound.tsx';
import Login from './pages/auth/Login.tsx';
import HomePage from './pages/HomePage.tsx';
// import TermsOfService from './pages/policies/TermsOfService.tsx';
// import PrivacyPolicy from './pages/policies/PrivacyPolicy.tsx';
import AIAssistantConfig from './components/Assistant/NewAssistantDetails/AIAssistantConfig.tsx';
import Billing from './pages/dashboard/Billing.tsx';
import HelpBox from './pages/support/HelpBox.tsx';
import ToolList from './components/Tool/ToolList.tsx';

const App = () => {
  return (
    <Routes>
      <Route path="/:workshopId" element={<DashboardSideBar/>}>
      <Route path=':assistantId' element={<AIAssistantConfig/>}></Route>
        <Route path='agents' element={<AssistantLists/>}></Route>
        <Route path='knowledgebase' element={<Knowledgebase/>}></Route>
        <Route path='call-history' element={<CallHistory/>}></Route>
        <Route path='batch-call' element={<BatchCall />} />
        <Route path='phone-numbers' element={<PhoneNumbers/>}></Route>
        <Route path='billing' element={<Billing/>}></Route>
        <Route path='agents/:assistantId' element={<AIAssistantConfig/>}></Route>
        <Route path='support' element={<HelpBox/>}></Route>
      <Route path='actions' element={<ToolList />}></Route>
      </Route>
        <Route path='/' element={<HomePage/>}></Route>
      {/* <Route path='pricing' element={<PricingPage/>}></Route> */}
      {/* <Route path='terms-of-service' element={<TermsOfService/>}></Route> */}
      {/* <Route path='privacy-policy' element={<PrivacyPolicy/>}></Route> */}
      <Route path='/auth/sign-in' element={<Login/>}></Route>
      <Route path="/*" element={<NotFound/>} />
    </Routes>
  );
};

export default App;