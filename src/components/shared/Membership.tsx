import { FC, Fragment, ReactNode, useState } from 'react'
import Link from 'next/link'
import useScssVar from '@/hooks/useScssVar'

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material';


export interface MembershipProps {
  errors: any;
  control: any;
  membershipsFields: any;
  appendMemberships: any;
  removeMemberships: any;
  Controller: any;
}

const Membership: FC<MembershipProps> = ((props: MembershipProps) => {
  const { muiVar } = useScssVar();
  const {
    errors,
    control,
    membershipsFields,
    appendMemberships,
    removeMemberships,
    Controller,
  } = props;

  const addInputField = () => {
    appendMemberships({
      membership: ''
    })
  }
  const removeInputFields = (index: number) => {
    removeMemberships(index)
  }


  return (
    <Fragment>
      <div className="card" style={muiVar}>
        <div className="card-body">
          <h4 className="card-title">Memberships</h4>
          {membershipsFields.map((data: any, index: number) => {
            return (
              <div className="membership-info" key={index} >
                <div className="row form-row membership-cont">
                  <div className="col-12 col-md-10 col-lg-5">
                    <div className="form-group">
                      <TextField
                        required
                        id={`membership_${index}`}
                        label="Membership"
                        error={errors?.['memberships']?.[index]?.['membership'] == undefined ? false : true}
                        helperText={errors?.['memberships']?.[index]?.['membership'] && errors['memberships'][index]['membership']['message'] as ReactNode}
                        {
                        ...control.register(`memberships.${index}.membership`, {
                          required: `This field is required `,
                        })
                        }
                        fullWidth
                        size='small'
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-2">
                    <div className="delete-icon">
                      <Link href="#0" className="btn btn-danger trash" onClick={(e) => {
                        e.preventDefault()
                        removeInputFields(index)
                      }} >
                        <i className="far fa-trash-alt"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {membershipsFields.length < 5 && <div className="add-more" >
            <Link href="#0" onClick={(e) => {
              e.preventDefault()
              addInputField()
            }} className="add-education">
              <i className="fa fa-plus-circle"></i> Add More
            </Link>
          </div>}
        </div>
      </div>
    </Fragment>
  )
})

export default Membership;