/* eslint-disable react/jsx-key */

/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useState, useRef, useEffect, useMemo, ReactNode } from 'react'
import useScssVar from '@/hooks/useScssVar'

//Mui
import { Transition, BootstrapDialog, BootstrapDialogTitle } from "@/components/shared/Dialog";
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteForever from '@mui/icons-material/DeleteForever'
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { ExtendedVitalSignTypes } from './ClinicalSignsHistory';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { toast } from 'react-toastify';
import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';
import MuiSwipeableTabs from '../shared/MuiSwipeableTabs';
import { Dashboard1, Dashboard2, Dashboard5, Dashboard6 } from '@/public/assets/imagepath';

import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import CustomPagination from '../shared/CustomPagination';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor } from '../DoctorDashboardSections/ScheduleTiming';
import VitalTabs from './VitalTabs';
export interface VitalTypeObjectForm {
  value: number;
  id: number;
  userId: string;
  name: string;
  date: Date;
}

const initialState: VitalTypeObjectForm = {
  value: 0,
  id: 0,
  userId: '',
  name: '',
  date: new Date(),
}


const MedicalDetailsPrepage: FC = (() => {
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  return (
    <Fragment>
      <div className="col-md-12 col-lg-12 col-xl-12 animate__animated animate__backInUp">
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


