import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Aitoflo</title>
        <meta name="description" content="Privacy Policy for Aitoflo" />
      </Helmet>
      <div className="min-h-screen bg-black text-white p-8 md:p-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy - Aitoflo</h1>
          <p className="text-gray-400 mb-4">Last Updated: January 2, 2025</p>

          <section className="space-y-6">
            <p className="text-gray-300">
              This Statement of Privacy applies to Aitoflo and governs data collection and usage. For the purposes of this Privacy Policy, unless otherwise noted, all references to Aitoflo include www.aitoflo.com and Aitoflo. The Aitoflo application is an AI-powered telecalling application. By using the Aitoflo application, you consent to the data practices described in this statement.
            </p>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Collection of Your Personal Information</h2>
              <p className="text-gray-300">
                We collect several different types of data for various purposes, primarily to provide and improve our Services. These data include:
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">1. Personal Data</h3>
                <p className="text-gray-300">
                  To better provide you with products and services, Aitoflo may ask you to provide certain personally identifiable information ("Personal Data") that can be used to contact or identify you. These may include, but are not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Cookies and Usage Data</li>
                </ul>
                <p className="text-gray-300">
                  We do not collect personal information unless you voluntarily provide it to us. We will use your information for purposes such as:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Communicating with you regarding services and/or products</li>
                  <li>Sending newsletters, marketing, or promotional materials</li>
                  <li>Responding to inquiries or service requests</li>
                </ul>
                <p className="text-gray-300">
                  You may opt out of receiving promotional communications by following the unsubscribe link or contacting us directly.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">2. Usage Data</h3>
                <p className="text-gray-300">
                  We may collect information automatically about how the Service is accessed and used ("Usage Data"). This Usage Data may include:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Your computer's Internet Protocol address (IP address)</li>
                  <li>Browser type and version</li>
                  <li>Pages visited on our Service</li>
                  <li>Time and date of your visit</li>
                  <li>Time spent on pages</li>
                  <li>Unique device identifiers</li>
                  <li>Other diagnostic data</li>
                </ul>
                <p className="text-gray-300">
                  When accessing the Service via a mobile device, additional data collected may include:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Device type and unique ID</li>
                  <li>Operating system and version</li>
                  <li>Mobile browser type and version</li>
                  <li>IP address</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">3. Location Data</h3>
                <p className="text-gray-300">
                  With your permission, we may collect and use your location data ("Location Data") to provide enhanced features or improve the Service. You can enable or disable location services via your device settings.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">4. Tracking & Cookies Data</h3>
                <p className="text-gray-300">
                  We use cookies and similar tracking technologies to track activity on our Service. Cookies are small files stored on your device that may include an anonymous unique identifier. Other tracking technologies, such as beacons, tags, and scripts, are also used to improve and analyze the Service.
                </p>
                <p className="text-gray-300">Examples of cookies we use:</p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Session Cookies: To operate our Service</li>
                  <li>Preference Cookies: To remember your preferences and settings</li>
                  <li>Security Cookies: For security purposes</li>
                  <li>Advertising Cookies: To serve relevant advertisements</li>
                </ul>
                <p className="text-gray-300">
                  You can configure your browser to refuse all cookies or to alert you when a cookie is being sent. Note that some features of the Service may not function properly without cookies.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Use of Data</h2>
                <p className="text-gray-300">Aitoflo uses collected data for the following purposes:</p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Providing and maintaining the Service</li>
                  <li>Notifying you about changes to the Service</li>
                  <li>Allowing participation in interactive features</li>
                  <li>Providing customer support</li>
                  <li>Analyzing data to improve the Service</li>
                  <li>Monitoring Service usage</li>
                  <li>Detecting, preventing, and addressing technical issues</li>
                  <li>Sending account-related notices and subscription information</li>
                  <li>Providing news, special offers, and similar products or services unless you opt out</li>
                  <li>Any other purposes disclosed at the time of data collection, with your consent</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Retention of Data</h2>
                <p className="text-gray-300">
                  We retain Personal Data only as long as necessary for the purposes outlined in this Privacy Policy. Retention durations:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Personal Data: Retained for legal, contractual, and business obligations</li>
                  <li>Usage Data: Retained for internal analysis or improved functionality, unless otherwise required by law</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Transfer of Data</h2>
                <p className="text-gray-300">
                  Your information, including Personal Data, may be transferred to computers outside your jurisdiction where data protection laws may differ. By submitting information, you consent to this transfer.
                </p>
                <p className="text-gray-300">
                  We take reasonable steps to ensure secure data transfer and storage and comply with applicable laws and regulations.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Disclosure of Data</h2>
                <p className="text-gray-300">
                  Aitoflo may disclose personal data under the following conditions:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Compliance with legal obligations or valid requests by public authorities</li>
                  <li>Merger, acquisition, or asset sale where Personal Data may be transferred</li>
                  <li>Disclosure to affiliates, subsidiaries, or trusted partners for legitimate purposes</li>
                                      <li>Protecting the rights, property, or safety of Aitoflo, users, or others</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Security of Data</h2>
                <p className="text-gray-300">
                  We employ commercially acceptable means to protect your data but cannot guarantee absolute security. Your use of the Service is at your own risk.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">E-mail Communications</h2>
                <p className="text-gray-300">
                  Aitoflo may send you emails for announcements, promotions, or updates. To stop receiving these communications, click "unsubscribe" or email us directly.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Your Data Protection Rights</h2>
                <h3 className="text-xl font-semibold">1. General Data Protection Regulation (GDPR)</h3>
                <p className="text-gray-300">
                  If you reside in the European Union (EU) or European Economic Area (EEA), you have rights including:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Access, update, or deletion of your data</li>
                  <li>Objection to or restriction of data processing</li>
                  <li>Withdrawal of consent where applicable</li>
                  <li>Complaint to a Data Protection Authority</li>
                </ul>
                <p className="text-gray-300">For inquiries, contact us at support@aitoflo.com.</p>

                <h3 className="text-xl font-semibold mt-4">2. California Consumer Privacy Act (CCPA)</h3>
                <p className="text-gray-300">
                  As a California resident, you may request:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Information on data collected, shared, or sold</li>
                  <li>Deletion of your personal information</li>
                  <li>Opt-out of data sale (if applicable)</li>
                </ul>
                <p className="text-gray-300">To exercise these rights, email us at support@aitoflo.com.</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Service Providers</h2>
                <p className="text-gray-300">
                  We employ third-party providers for services such as:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>Analytics: Google Analytics, Vapi AI</li>
                  <li>Payment Processing: Lemonsqueezy</li>
                </ul>
                <p className="text-gray-300">
                  These providers access Personal Data only to perform tasks on our behalf.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Changes to this Privacy Policy</h2>
                <p className="text-gray-300">
                  We may update this Privacy Policy from time to time. Changes will be posted on this page.
                </p>
              </div>

              <div className="mt-8 text-gray-400">
                <p>For questions or concerns, contact us at support@aitoflo.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;