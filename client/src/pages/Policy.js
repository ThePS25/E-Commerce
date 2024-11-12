import React from "react";
import Layout from "../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="privacyPolicy" style={{ padding: "150px 75px 75px 0px" }}>
        <h1 className="bg-dark p-2 text-white text-center">PRIVACY POLICY</h1>
        <div className="policyContent">
          <h2>Information We Collect</h2>
          <ul>
            <li>
              We may collect various types of information from you when you
              visit or interact with our website. This may include your name,
              email address, contact information, and other details you
              voluntarily provide.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>The information we collect may be used to:</li>
            <li>Process and fulfill your orders</li>
            <li>Improve our website and services</li>
            <li>Communicate with you regarding your inquiries or requests</li>
            <li>Send you promotional offers or updates with your consent</li>
          </ul>

          <h2>Information Sharing</h2>
          <ul>
            <li>
              We do not sell, trade, or transfer your personal information to
              third parties without your consent, except as necessary to provide
              our services or comply with legal obligations.
            </li>
          </ul>

          <h2>Security Measures</h2>
          <ul>
            <li>
              We take appropriate measures to protect your personal information
              from unauthorized access, disclosure, alteration, or destruction.
              However, please note that no data transmission over the internet
              or storage system can be guaranteed as 100% secure.
            </li>
          </ul>

          <h2>Third-Party Links</h2>
          <ul>
            <li>
              Our website may contain links to third-party websites. We have no
              control over and assume no responsibility for the content, privacy
              policies, or practices of these websites. We encourage you to
              review the privacy policies of any third-party sites you visit.
            </li>
          </ul>

          <h2>Updates to this Privacy Policy</h2>
          <ul>
            <li>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page, and the revised version will become
              effective immediately. We encourage you to review this page
              periodically for any updates.
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
