

import { SyntheticEvent, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import _ from 'lodash'
import { SxProps, Theme, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export interface StepsType {
  stepName: string;
  stepComponent: React.ReactNode;
  stepId: any;
  isValidated: Function;
  handleChange?: Function;
  isDisable: boolean;
  hasParams: boolean;
  paramsObj: { [key: string]: string | number }
}

export interface MuiSwipeableTabsProps {
  steps: StepsType[];
  activeTab: number;
}

const MuiSwipeableTabs: React.FC<MuiSwipeableTabsProps> = ((
  { steps, activeTab }
) => {
  const theme = useTheme();
  const router = useRouter();
  const storageKey = useMemo(() => {
    const parts = (router.pathname || '').split('/').filter(Boolean);
    const base = parts.length >= 3 ? `/${parts.slice(0, 3).join('/')}` : `/${parts.join('/') || ''}`;
    return `MuiSwipeableTabsActiveStep:${base}`;
  }, [router.pathname]);
  const [sxProps, setSxProbs] = useState<SxProps<Theme>>()
  const [value, setValue] = useState<string>(`${activeTab}`);
  const isSmalldevice = useMediaQuery('(max-width:600px)');
  // After hydration, read sessionStorage and update state if needed.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(storageKey);
      if (stored !== null && stored !== value) {
        // don't cause mismatch — this runs after hydration
        setValue(stored);
      }
    }
  }, [storageKey, value]);
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
    sessionStorage.setItem(storageKey, newValue)
    const currentStep = steps[Number(newValue)]
    let { hasParams, paramsObj } = currentStep
    if (steps[Number(value)]?.isValidated()) {
      setValue(newValue);
    }
    //Update url params
    if (hasParams) {
      router.push(`${router.pathname}${`?${btoa(JSON.stringify(paramsObj))}`}`)
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setValue(sessionStorage.getItem(storageKey) || '0')
    }
  }, [storageKey])

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      setSxProbs({
        [theme.breakpoints.up('sm')]: {
          left: `${Number(value) * (100 / steps.length)}% !important`,
          minWidth: `${100 / steps.length}%`,
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
        [theme.breakpoints.down('sm')]: {
          display: 'none'
        }
      })
    }
  }, [steps.length, value, theme.breakpoints])

  return (
    <Box key={steps.toString()}>
      <AppBar position="static">
        <Tabs
          orientation={isSmalldevice ? 'vertical' : 'horizontal'}
          value={value}
          onChange={handleChangeTab}
          aria-label="lab API tabs example" textColor="secondary"
          indicatorColor="secondary"
          slotProps={{
            indicator: { sx: sxProps },
            root: {
              sx: {
                [theme.breakpoints.down('sm')]: {
                  '& .MuiTab-root': {
                    maxWidth: 'unset !important',
                  }
                },
              }
            }
          }}>
          {
            steps.map((step: StepsType, index: number) => {
              return (
                <Tab key={index} value={`${index}`} label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {typeof step.stepId === "string" ? (
                      <span style={{ color: index != Number(value) ? '#fff' : theme.palette.secondary.main, opacity: 1 }}>{step.stepId}</span>
                    ) : (
                      <span className={`${index != Number(value) ? 'stepid-text-color-not-active' : 'stepid-text-color-active'}`} style={{ opacity: 1 }}>{step.stepId}</span>
                    )}
                  </div>
                } disabled={step.isDisable} sx={{ minWidth: `${100 / steps.length}%` }} />
              )
            })
          }
        </Tabs>
      </AppBar>
      {
        steps.map((step: StepsType, index: number) => {
          return (
            <TabPanel key={index} index={index} value={Number(value)} dir={theme.direction} >
              {step.stepComponent}
            </TabPanel>
          )
        })
      }
    </Box>
  );
})

export default MuiSwipeableTabs;