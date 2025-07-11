import { Helmet } from 'react-helmet-async';

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Billing & Refunds Policy - Aitoflo</title>
        <meta name="description" content="Billing and Refund Policy for Aitoflo" />
      </Helmet>
      <div className="min-h-screen bg-black text-white p-8 md:p-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold mb-8">Billing & Refunds Policy</h1>
          <p className="text-gray-400 mb-8">
            At Aitoflo, we strive to provide the best value and service for our customers. Please carefully review our billing and refund policies outlined below:
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Billing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscription Plans: We offer both monthly and annual subscription plans to access our services.</li>
              <li>Payment Terms: Payments are charged at the start of each billing cycle (monthly or annually) based on your chosen plan.</li>
              <li>Automatic Renewal: All subscriptions automatically renew at the end of the billing period unless canceled in advance.</li>
            </ul>
          </section>

          {/* Add sections 2-4 with similar structure */}
          
          <section className="mt-12">
            <p>If you have questions or concerns regarding billing, please contact our support team at support@aitoflo.com</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;
