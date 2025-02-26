import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'


const PrivacyDetails: FC = (() => {
  const { muiVar } = useScssVar();

  return (
    <Fragment>
      <section className="terms-section   animate__animated animate__backInUp" style={muiVar}>
        <div className="card" style={{ padding: "20px 10px" }}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="privacy-content">
                  <h3>Privacy Policy</h3>
                  <h3>Last Updated: January 14, 2025</h3>
                  <p>The Health Care (&quot;Health Care,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;)
                    is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information,
                    in compliance with the Law, and also provides transparency
                    about our practices, especially in relation to data collected
                    through sign-up forms for webinars, offline events, and other interactions through advertising platforms.
                  </p>
                  <Privacy />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default PrivacyDetails;

export const Privacy: FC = () => {
  return (
    <Fragment>
      <h3>Information We Collect:</h3>
      <p>
        We collect various types of personal data, including your contact information such as your name,
        email address, and other details you provide. Additionally, we gather donation and payment details, which
        are processed securely through third-party payment gateways. To enhance our website and user experience,
        we also collect website usage data through cookies and similar technologies.
        This information includes details about your interactions with our website, such as the pages you visit, the time you spend on the site,
        and other usage patterns that help us improve functionality and performance. Furthermore, when you sign up,
        we collect personal data provided through the sign-up forms.
      </p>

      <h3>How We Use Your Information:</h3>
      <p>
        Your data is processed for specific purposes:
        to process and confirm your donations, to communicate with you about our activities, campaigns, and events,
        to analyze website usage and enhance user experience, and to meet legal obligations and regulatory requirements.
        The processing of personal data is based on your consent, our contractual obligations, or legal requirements, as applicable.
      </p>
      <h3>Information Sharing and Security:</h3>
      <p>We do not share your personal data with third parties for marketing purposes.
        However, we may share your data with trusted service providers who assist us in our operations,
        ensuring they comply with The country data protection standards.
        If data is transferred outside Switzerland, appropriate safeguards such as standard contractual clauses or equivalent measures
        will be implemented to protect your information. We employ technical and organizational measures, including encryption, secure servers,
        and restricted access, to protect your data against unauthorized access, loss, or misuse.</p>
      <h3>Data Retention:</h3>
      <p>
        We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.
        For example, reservation records are retained for legal and audit purposes for a minimum of six (6) month, while website
        analytics data is retained for up to twenty-four (24) months. Data that is no longer required will be securely deleted or anonymized.
      </p>
      <h3>Automated Decision-Making</h3>
      <p>
        We do not engage in automated decision-making that has legal or similarly significant effects on you. You also have the right to be informed about how your data is used, to access financial information, to request confidentiality or anonymity, to opt-out of communications, and to request corrections or reviews of your information.
      </p>
      <h3>Your Rights:</h3>
      <p>You have the right to:</p>
      <div className="terms-text terms-list">
        <p>
          <i className="fas fa-circle-check" />
          Be informed about Health Care and how donations are used.
        </p>
        <br />
        <p>
          <i className="fas fa-circle-check" />
          Access financial information.
        </p>
        <br />
        <p>
          <i className="fas fa-circle-check" />
          Confidentiality.
        </p>
        <br />
        <p>
          <i className="fas fa-circle-check" />
          Opt-out of communications.
        </p>
        <br />
        <p>
          <i className="fas fa-circle-check" />
          Anonymity.
        </p>
        <br />
        <p>
          <i className="fas fa-circle-check" />
          Ask questions and receive truthful answers
        </p>
        <br />
        <p>
          <i className="fas fa-circle-check" />
          You can opt-out of communications
        </p>
        <br />
        <p>
          <i className="fas fa-circle-check" />
          Request to review or correct your information.
        </p>
      </div>
      <br />
      <p>
        Our primary legal framework for processing personal data is the country law.
        However, if you are a user  in a jurisdiction outside of The country,
        for instance in the European Union (EU), California (USA), or any other country with data protection laws, w
        e will comply with the applicable laws governing the processing of your personal data in that jurisdiction.
        This includes, but is not limited to, compliance with the General Data Protection Regulation (GDPR)
        for individuals in the EU/EEA, California Consumer Privacy Act (CCPA) and others as legally appliable.
        We will ensure that your personal data is processed in a manner that respects your rights under the relevant data protection laws,
        including, where applicable, the right to access, correct, delete, restrict, or object to the processing of your personal data. Additionally,
        we will uphold your right to data portability and the right to withdraw consent, where applicable.
        By providing your personal data, you acknowledge and consent to the processing of your data in accordance with
        the applicable data protection laws of your jurisdiction, alongside the Swiss data protection regulations.

      </p>
      <h3>Changes to This Policy:</h3>
      <p>This policy may be updated periodically to reflect changes in our practices or legal requirements.
        The latest version will always be available on our website. Please review this policy regularly.</p>
      <h3>Contact Us:</h3>
      <p>
        If you have any questions or concerns regarding this privacy policy, please contact us by email at
        <a href="mailto:mjcode2020@gmail.com"> mjcode2020@gmail.com</a>.
      </p>
      <p>By agreeing to this policy, you acknowledge that you understand how your data will be used and the measures taken to protect it. This policy ensures that your personal information is handled in a compliant manner.</p>


    </Fragment>
  )
}