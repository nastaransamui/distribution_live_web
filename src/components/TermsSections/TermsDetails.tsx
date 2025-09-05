import { FC, Fragment, useEffect, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'


const TermsDetails: FC = (() => {
  const { muiVar } = useScssVar();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>
      <section className={`terms-section   ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`} style={muiVar}>
        <div className="card" style={{ padding: "20px 10px" }}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="terms-content">
                  <h2>Health Care</h2>
                  <h3>Terms & Conditions</h3>
                  <h3>Last Updated: January 14, 2025</h3>
                  <p>By accessing or using the website owned and operated by
                    Health Care, you, as the &quot;User,&quot;
                    agree to be bound by these Terms and Conditions (&quot;Terms&quot;).
                    If you do not agree to these Terms in full, you must immediately cease using this website.
                  </p>
                  <Terms />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default TermsDetails;

export const Terms: FC = () => {
  return (
    <Fragment>
      <ol className='outer-list'>
        <li>
          <span>Lawful Use:</span>
          <p>
            As a User of this website, you agree to use the site solely for lawful purposes and in compliance with the applicable laws of This Country.
            Your use of the website must not infringe upon the rights of Health Care, other users, or third parties.
            You further agree to refrain from any conduct that may interfere with the proper functioning of the website.
          </p>
        </li>
        <li>
          <span>Limitation of Liability: </span>
          <p>
            To the fullest extent permitted by applicable law, Health Care shall not be liable for any damages,
            including but not limited to direct, indirect, incidental, consequential, or punitive damages, arising out of or related
            to your use or inability to use this website or its content. This exclusion of liability does not apply in cases of unlawful
            intent or gross negligence, as stipulated in  Code of Obligations.
          </p>
        </li>
        <li>
          <span>Modification of Terms: </span>
          <p>
            Health Care reserves the right to modify, update, or amend these Terms at any time without prior notice.
            Any changes to these Terms will be posted on this website, and your continued use of the website following the
            posting of such changes constitutes your acceptance of the modified Terms.
          </p>
        </li>
        <li>
          <span>Accuracy and Availability: </span>
          <p>
            Health Care does not guarantee that this website will be error-free, uninterrupted, or free of viruses or other harmful components.
            While Health Care strives for accuracy, the website content is provided without warranty,
            and Health Care makes no representation regarding the accuracy or completeness of the content or the availability of the website.
          </p>
        </li>
        <li>
          <span>Third-Party Links: </span>
          <p>
            This website may contain links to third-party websites. Health Care does not control or endorse the content of external websites,
            and such links are provided for convenience only. Health Care shall not be held responsible for the content or the availability of third-party websites.
          </p>
        </li>
        <li>
          <span>User-Generated Content: </span>
          <p>
            Any communication, material, or content that you transmit, submit, or post in any public area of this website will be treated as non-confidential and
            non-proprietary unless otherwise stated. Health Care reserves the right to remove or modify any such content at its sole discretion and without notice.
          </p>
        </li>
        <li>
          <span>Indemnity: </span>
          <p>You agree to indemnify, defend, and hold harmless Health Care, its directors, employees, agents, and affiliates from and against any
            claims, liabilities, damages, or costs
            (including reasonable legal fees) arising out of or related to your violation of these Terms, applicable laws, or the rights of any third party.</p>
        </li>
        <li>
          <span>Jurisdiction: </span>
          <p>
            These Terms shall be governed by and construed in accordance with the substantive laws of This Country.
            Any disputes arising under or in connection with these Terms shall fall under the exclusive jurisdiction of the competent courts of This Country,
            unless otherwise required by mandatory law.
          </p>
        </li>
        <li>
          <span>Disclaimers</span>
          <ol>
            <li>
              <strong>Information Accuracy</strong><br />
              <p>All information provided on this website is published in good faith and for general informational purposes only. While Health Care
                endeavors to provide accurate, reliable, and up-to-date information, no representations or warranties are made
                regarding the completeness, accuracy, or reliability of the information provided. Users are advised to independently verify any
                information before relying on it.</p>
            </li>
            <li>
              <strong>User Risk</strong><br />
              Any action you take based on the information provided on this website is strictly at your own risk.
              Health Care shall not be liable for any loss, damage, or injury arising from the use of the website or reliance on the information contained herein.
            </li>
            <li>
              <strong>Third-Party Content</strong><br />
              Health Care strives to provide links to ethical and reputable third-party websites.
              However, Health Care does not control the content or operations of these websites. Any links to external websites are provided for
              convenience only and do not imply endorsement or responsibility for the content found on such sites.
            </li>
            <li>
              <strong>External Policies</strong><br />
              When you navigate away from this website, you may encounter websites with different privacy policies and terms of use.
              Health Care is not responsible for the practices or content of external websites, and it is your responsibility to review the terms and policies of
              any third-party site.
            </li>
            <li>
              <strong>&quot;As Is&quot; Basis</strong><br />
              The content, materials, and services on this website are provided on
              an &quot;as is&quot; and &quot;as available&quot; basis. Health Care disclaims all warranties,
              either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose,
              and non-infringement, except as required under applicable intellectual property laws.
            </li>
            <li>
              <strong>Liability for Damages</strong><br />
              In no event shall Health Care, its suppliers, or its service providers be liable for any damages,
              including but not limited to damages for loss of data, profit, or business interruption, arising out of or
              related to the use or inability to use the website materials, except where liability cannot be excluded under This Country law.
            </li>
          </ol>
        </li>
        <li>
          <span>Force Majeure: </span>
          <p>
            Health Care shall not be held liable for failure to perform any obligation under these Terms, if such failure is due to events or
            circumstances beyond its reasonable control. This includes, but is not limited to, acts of God,
            natural disasters, war, terrorism, civil unrest, strikes, technical failures, or any other events that prevent or delay the performance of its obligations.
          </p>
        </li>
        <li>
          <span>Severability: </span>
          <p>
            If any provision of these Terms is found to be unlawful, invalid, or unenforceable under applicable law,
            such provision shall be deemed severed from these Terms. The remaining provisions shall remain valid
            and enforceable to the fullest extent permitted by law.
          </p>
        </li>
        <li>
          <span>Entire Agreement: </span>
          <p>
            These Terms, along with Health Care Privacy and Cookie policy constitute the entire agreement between you and Health Care
            with respect to your use of this website.
            These Terms supersede and replace any prior agreements, discussions, or communications,
            whether written or oral, relating to the use of the website.
          </p>
        </li>
        <li>
          <span>Contact us:</span>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at
            <a href="mailto:mjcode2020@gmail.com"> mjcode2020@gmail.com</a>.
          </p>
        </li>
      </ol>
    </Fragment>
  )
}