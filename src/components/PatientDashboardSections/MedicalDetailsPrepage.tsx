
/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import MuiSwipeableTabs from '../shared/MuiSwipeableTabs';
import { Dashboard1, Dashboard2, Dashboard5, Dashboard6 } from '@/public/assets/imagepath';
import VitalTabs from './VitalTabs';
export interface VitalTypeObjectForm {
  value: number;
  id: number;
  userId: string;
  name: string;
  date: Date;
}




const MedicalDetailsPrepage: FC = (() => {

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>
      <div className={`col-md-12 col-lg-12 col-xl-12 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>
        <div className="row">
          <div className="card">
            <div className="card-body">
              <MuiSwipeableTabs steps={
                [
                  {
                    stepName: "Heart Rate",
                    stepComponent: <VitalTabs
                      stepName='heartRate'
                      stepUnit='bpm'
                      stepLabel='Heart Rate /bpm'
                      stepImage={Dashboard1}
                    />,
                    stepId: <Stack sx={{ alignItems: 'center' }}>
                      <img src={Dashboard1} width={35} alt='' />
                      <span>Heart Rate</span>
                    </Stack>,
                    isValidated: () => true,
                    isDisable: false,
                    hasParams: false,
                    paramsObj: {}
                  },
                  {
                    stepName: "Body Tempreture",
                    stepComponent: <VitalTabs
                      stepName='bodyTemp'
                      stepUnit='℃'
                      stepLabel='Body tempreture /℃'
                      stepImage={Dashboard2}
                    />,
                    stepId: <Stack sx={{ alignItems: 'center' }}>
                      <img src={Dashboard2} width={35} alt='' />
                      <span>Body Tempreture</span>
                    </Stack>,
                    isValidated: () => true,
                    isDisable: false,
                    hasParams: false,
                    paramsObj: {}
                  },
                  {
                    stepName: "Weight",
                    stepComponent: <VitalTabs
                      stepName='weight'
                      stepUnit='kg'
                      stepLabel='Weight /㎏'
                      stepImage={Dashboard5}
                    />,
                    stepId: <Stack sx={{ alignItems: 'center' }}>
                      <img src={Dashboard5} width={35} alt='' />
                      <span>Weight</span>
                    </Stack>,
                    isValidated: () => true,
                    isDisable: false,
                    hasParams: false,
                    paramsObj: {}
                  },
                  {
                    stepName: "Height",
                    stepComponent: <VitalTabs
                      stepName='height'
                      stepUnit='cm'
                      stepLabel='Height /㎝'
                      stepImage={Dashboard5}
                    />,
                    stepId: <Stack sx={{ alignItems: 'center' }}>
                      <img src={Dashboard6} width={35} alt='' />
                      <span>Height</span>
                    </Stack>,
                    isValidated: () => true,
                    isDisable: false,
                    hasParams: false,
                    paramsObj: {}
                  },
                ]
              }
                activeTab={0} />
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  )
});

export default MedicalDetailsPrepage;


