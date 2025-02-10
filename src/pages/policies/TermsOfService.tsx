import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms of Service - Dialoft AI</title>
        <meta name="description" content="Terms of Service for Dialoft AI" />
      </Helmet>
      <div className="min-h-screen bg-black text-white p-8 md:p-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold mb-8">Terms of Service - Dialoft AI</h1>
          <p className="text-gray-400 mb-4">Last Updated: January 2, 2025</p>

          <p className="mb-6">
            This Agreement is between Dialoft AI (Owner of Dialoft AI) and the person (natural or legal) accessing or using the Product. These Terms of Service ("Terms") constitute an agreement between Dialoft AI ("Dialoft AI," "we," "us") and you, governing your use of the Site and services (as defined below) offered by Dialoft AI. By signing up, accessing, or using the Product, you acknowledge your acceptance of this Agreement and consent to be bound by its terms and conditions.
          </p>
          <p className="mb-6">
            If you are accessing or using the Product on behalf of your company, you certify that you have the authority to accept this Agreement on behalf of your firm. Do not use the Site if you do not agree to these Terms or if your jurisdiction does not honor them. Persons under the age of 13 are not authorized to use the Site.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Overview of Services</h2>
            <p className="mb-4">Dialoft AI is a SaaS platform providing AI-driven telecalling solutions. These services include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Outbound Calling Services: Automated AI-powered outbound calls for various purposes, such as customer engagement, reminders, and lead generation.</li>
              <li>Inbound Calling Services: AI-powered virtual agents to handle incoming calls and queries.</li>
              <li>Custom Call Handling: Integration options for advanced workflows, such as customer support and telemarketing campaigns.</li>
              <li>Dashboard: A user-friendly dashboard for campaign management, analytics, and customization.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Fees and Payment Terms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">2.1 Cloud Service Fees</h3>
                <p>The pricing for Dialoft AI services is available on the official pricing page. Users will be billed based on the plan selected during account setup and the actual usage within each subscription period.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2.2 Payment Terms</h3>
                <p>If an automatic payment method fails, Dialoft AI will issue an invoice due within 14 days. A 7-day grace period will follow if the invoice remains unpaid. Failure to pay within the grace period may result in service suspension until payment is received. Persistent non-payment may lead to termination of services.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2.3 Price Adjustments</h3>
                <p>Dialoft AI reserves the right to adjust pricing by providing at least seven (7) days' notice via email or the platform. New pricing will take effect at the start of the next subscription period.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Key Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Customer: The individual or company accessing or using the Product.</li>
              <li>Effective Date: The date the Customer first accepts this Agreement.</li>
              <li>Invoice Period: Monthly.</li>
              <li>Payment Period: One day from the date of invoice.</li>
              <li>Provider: Dialoft AI</li>
              <li>Subscription Start Date: Date of account creation.</li>
              <li>Subscription Period: Depend on which pricing plan you select.</li>
              <li>Non-Renewal Notice Period: A minimum of 30 days before the current subscription period ends.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">4.1 General Use</h3>
                <p className="mb-4">Dialoft AI's Acceptable Use Policy aims to prevent misuse, ensure compliance with applicable laws, and protect the integrity of its systems and services. Any action that disrupts these systems or violates laws is strictly prohibited.</p>
                <p>Users agree not to use the services for activities that:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violate any laws or regulations.</li>
                  <li>Infringe on intellectual property or the rights of others.</li>
                  <li>Harass, defame, or abuse any individual or entity.</li>
                  <li>Impersonate others or engage in deceptive practices.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4.2 Telemarketing Compliance</h3>
                <div className="space-y-6">
                  <p className="mb-4">
                    You must not use the Services in violation of applicable laws governing the making and sending of calls and text messages. Customers are required to comply with all telemarketing, AI usage, and data privacy laws in the jurisdictions where they operate, including (but not limited to):
                  </p>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">United States</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Telemarketing and Consumer Fraud and Abuse Prevention Act</li>
                      <li>Telephone Consumer Protection Act (TCPA)</li>
                      <li>Rules promulgated by the Federal Communications Commission (FCC) pursuant to the TCPA</li>
                      <li>Federal Trade Commission (FTC) Act</li>
                      <li>FTC's Telemarketing Sales Rule (TSR)</li>
                      <li>Do-Not-Call (DNC) registry</li>
                      <li>Federal and state anti-wiretapping or eavesdropping laws</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Among other things, these laws and regulations may:</h4>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Require you to obtain prior express consent for auto-dialed or prerecorded calls or texts sent or made to the called party.</li>
                      <li>Require documentation or other proof of consent, which may need to be in writing for certain types of calls.</li>
                      <li>Prohibit altering the caller ID information transmitted with a call or text with the intent to defraud, cause harm, or wrongfully obtain anything of value.</li>
                      <li>Require the inclusion of an automated interactive telemarketing opt-out mechanism available at the outset of prerecorded messages.</li>
                      <li>Require you to include a disclosure of AI voice use at the beginning of the call.</li>
                      <li>Require you to notify parties to the call that their call is being recorded, seek prior express consent for the recording, and disclose the use of third-party vendors for call analytics.</li>
                      <li>Prohibit making calls before 8 a.m. or after 9 p.m. at the called party's location.</li>
                      <li>Prohibit calling a number listed on the national, state, or organization-specific Do-Not-Call (DNC) registry.</li>
                    </ol>
                  </div>

                  <p className="mb-6">
                    Customers using Dialoft AI must scrub phone numbers against the applicable federal, state, and Customer-specific Do-Not-Call (DNC) lists regularly, and in no event less frequently than every 31 days.
                  </p>
                  
                  <p className="mb-6">
                    If consumer consent is required under applicable laws to place calls using Dialoft AI, Customers must document proof of the required level of consent for each consumer they contact. Such documentation must be preserved for at least the minimum amount of time prescribed by applicable law, but in no case less than five years. Dialoft AI retains the right to audit your use of our Services to ensure compliance with the applicable laws.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">International Markets</h4>
                    <p className="mb-4">Customers are required to comply with all applicable telemarketing, AI usage, and data privacy laws in the jurisdictions where they operate, including but not limited to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><span className="font-semibold">European Union (EU):</span> General Data Protection Regulation (GDPR) – Focuses on obtaining prior express consent for data usage, call recordings, and transparency in communication.</li>
                      <li><span className="font-semibold">Canada:</span> Canada's Anti-Spam Legislation (CASL) – Requires prior express consent for calls/texts and includes provisions for the national DNC list.</li>
                      <li><span className="font-semibold">Australia:</span> Australian Communications and Media Authority (ACMA) – Governs telemarketing, AI voice use, call recordings, and the national DNC registry.</li>
                      <li><span className="font-semibold">United Kingdom:</span> Privacy and Electronic Communications Regulations (PECR) – Sets rules for telemarketing, including consent and call timing regulations.</li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Among other things, these international laws may:</h4>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Require explicit consent for calls, texts, and AI usage, including for auto-dialed or prerecorded messages.</li>
                      <li>Prohibit altering caller ID information with intent to deceive or defraud.</li>
                      <li>Require full transparency, including a disclosure of AI voice use at the beginning of any call.</li>
                      <li>Mandate proper notification of call recordings, obtaining prior express consent where required.</li>
                      <li>Prohibit calls made outside permissible timeframes, such as before 8 a.m. or after 9 p.m.</li>
                      <li>Require regular scrubbing of contact lists against national and local DNC registries.</li>
                    </ol>
                  </div>

                  <p className="mb-6">
                    Customers are solely responsible for ensuring compliance with these laws and must consult legal professionals where necessary. Dialoft AI does not assume responsibility for ensuring Customer compliance but retains the right to audit your use of our Services.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Global Compliance Responsibilities</h4>
                    <p className="mb-4">By using Dialoft AI, you agree to:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>Abide by all applicable telemarketing, AI usage, and data privacy laws in the regions where you operate.</li>
                      <li>Obtain, document, and maintain proper consent from consumers before making calls or sending texts.</li>
                      <li>Regularly scrub your contact lists against applicable DNC registries to avoid contacting restricted numbers.</li>
                      <li>Notify call recipients of AI voice use at the beginning of the call and provide opt-out mechanisms for prerecorded messages where required.</li>
                      <li>Ensure transparency regarding call recording and obtain explicit consent if necessary.</li>
                    </ol>
                  </div>

                  <p className="mb-6">
                    Dialoft AI retains the right to review your activities on the platform to ensure compliance with all relevant laws and regulations. Any violations of these terms may result in the suspension or termination of your account without prior notice.
                  </p>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Important Notice</h4>
                    <p>
                      The laws and regulations mentioned above are not exhaustive, and Customers are solely responsible for compliance with the laws applicable in their regions. Dialoft AI strongly recommends consulting a qualified legal professional to ensure compliance with all relevant telemarketing, AI, and data privacy laws.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4.3 Fraud Prevention</h3>
                <p>Fraudulent activities, such as phishing, Ponzi schemes, or misrepresentation, are strictly prohibited. Misuse of AI voices without proper authorization is also forbidden.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4.4 Data Privacy</h3>
                <p>Users must handle personal data in compliance with applicable privacy laws, ensuring data security and confidentiality.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4.5 Termination for Violations</h3>
                <p>Dialoft AI reserves the right to terminate services for violations of the Acceptable Use Policy at its sole discretion.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Arbitration</h2>
            <p className="mb-4">Any disputes arising from these Terms will be resolved through binding arbitration under the Federal Arbitration Act. Arbitration will be conducted by a neutral arbitrator in a mutually agreed location. The arbitrator's decision will be final, and judgment may be entered in a court of competent jurisdiction.</p>
            <p>Both parties agree to bear their legal costs, with the prevailing party entitled to reasonable attorney fees.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Indemnification</h2>
            <p className="mb-4">You agree to indemnify, defend, and hold harmless Dialoft AI, its officers, employees, and affiliates from claims, damages, or expenses arising from:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use or inability to use the services.</li>
              <li>Violations of these Terms.</li>
              <li>Infringements of third-party rights or applicable laws.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Warranty Disclaimer</h2>
            <p>Services are provided "as is" without warranties of any kind, either express or implied. Dialoft AI does not guarantee uninterrupted, error-free service and disclaims liability for data loss, delays, or service interruptions.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>Dialoft AI's liability is limited to the amount paid for the service that caused the claim during the 12 months preceding the claim or $50, whichever is greater. This limitation applies to the maximum extent permitted by law.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Amendments and Termination</h2>
            <p>Dialoft AI reserves the right to amend these Terms at any time by providing notice via email or the platform. Continued use of the services after amendments constitutes acceptance.</p>
          </section>

          <section className="mt-12 border-t pt-8 text-gray-400">
            <p>For any questions or concerns regarding these Terms, please contact us at support@dialoftai.com</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;