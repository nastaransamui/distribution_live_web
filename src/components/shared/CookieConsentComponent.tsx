import { useEffect } from "react";
import { useTheme } from "@mui/material";
import * as CookieConsent from "vanilla-cookieconsent";

export default function CookieConsentComponent() {
  const theme = useTheme();
  useEffect(() => {
    if (theme.palette.mode == 'dark') {
      document.documentElement.classList.add('cc--darkmode');
    } else {
      document.documentElement.classList.remove('cc--darkmode');
    }
    CookieConsent.run({
      language: {
        default: 'en',
        autoDetect: 'browser',
        translations: {
          en: {
            consentModal: {
              title: ' We Value Your Privacy',
              description:
                'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent. ',
              acceptAllBtn: 'Accept All',
              acceptNecessaryBtn: 'Accept Necessary',
              showPreferencesBtn: 'Manage individual preferences',
              footer: `
                    <a href="/terms" target="_blank" >Terms & Conditions</a>
                    <a href="/privacy" target="_blank">Privacy Policy</a>
                `
            },
            preferencesModal: {
              title: 'Setting ',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Accept necessary only',
              savePreferencesBtn: 'Accept current selection',
              closeIconLabel: 'Close modal',
              sections: [
                {
                  title: 'Cookie Usage',
                  description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="/privacy" class="cc-link" target="_blank" >privacy policy</a>.',

                },
                {
                  title: 'Strictly Necessary Cookies',
                  description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Performance and Analytics Cookies',
                  description: 'These cookies allow the website to remember the choices you have made in the past.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    caption: 'List of cookies',
                    headers: {
                      name: 'Name',
                      description: 'Description',
                      duration: 'Duration'
                    },
                    body: [
                      {
                        name: '^_ga',
                        duration: '2 years',
                        description: "description ...",
                      },
                      {
                        name: '_gid',
                        duration: '1 day',
                        description: "description ...",
                      }
                    ]
                  }
                },
                {
                  title: 'Advertisement and Targeting Cookies',
                  description: 'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.',
                  linkedCategory: 'analytics',
                },
                {
                  title: 'More Information',
                  description:
                    'For any queries in relation to my policy on cookies and your choices, please <a target="_blank"  class="cc-link" href="/contact">contact us</a>.',
                  linkedCategory: 'analytics',
                },
              ]
            },
          },

        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false
        }
      },
      guiOptions: {
        consentModal: {
          layout: 'bar'
        }
      }
    },);
  }, [theme]);

  return null;
}