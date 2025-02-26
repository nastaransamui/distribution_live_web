//@ts-nocheck
import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import _ from 'lodash'

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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
  const [value, setValue] = React.useState(activeTab);
  const router = useRouter();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event
    const currentStep = steps[newValue]
    let { hasParams, paramsObj } = currentStep
    if (steps[value]?.isValidated()) {
      setValue(newValue);
    } else {
      alert(`${steps[value].stepName} need validatieon`)
    }
    //Update url params
    if (hasParams) {
      router.push(`${router.pathname}${`?${btoa(JSON.stringify(paramsObj))}`}`)
    }
  }
  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box >
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          sx={{
            color: '#000'
          }}
        >
          {
            steps.map((step: StepsType, index: number) => {
              return (
                <Tab key={index} label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {typeof step.stepId === "string" ? (
                      <span>{step.stepId}</span>
                    ) : (
                      step.stepId
                    )}
                  </div>
                } disabled={step.isDisable} />
              )
            })
          }
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
        slideStyle={{ overflowX: "hidden" }}
      >
        {
          steps.map((step: StepsType, index: number) => {
            return (
              <TabPanel key={index} index={index} value={value} dir={theme.direction} >
                {step.stepComponent}
              </TabPanel>
            )
          })
        }
      </SwipeableViews>
    </Box>
  );
})

export default MuiSwipeableTabs;