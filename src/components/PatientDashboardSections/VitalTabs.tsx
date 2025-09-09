import useScssVar from '@/hooks/useScssVar';
import React, { FC, Fragment, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AppState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridFilterModel, GridRenderCellParams, GridRowId, GridRowParams, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';
import CustomToolbar, { convertFilterToMongoDB, createCustomOperators, DataGridMongoDBQuery, globalFilterFunctions, useDataGridServerFilter } from '../shared/CustomToolbar';
import { VitalTypeObject } from './ClinicalSignsHistory';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { getSelectedBackgroundColor, getSelectedHoverBackgroundColor, LoadingComponent } from '../DoctorDashboardSections/ScheduleTiming';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import CustomPagination from '../shared/CustomPagination';
import CustomNoRowsOverlay from '../shared/CustomNoRowsOverlay';
import { UserPatientProfileType, UserPatientProfileTypeValue } from '@/redux/userPatientProfile';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { BootstrapDialog, BootstrapDialogTitle, Transition } from '../shared/Dialog';
import Image, { StaticImageData } from 'next/image';
import FormHelperText from '@mui/material/FormHelperText'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { NumericFormat } from 'react-number-format';


export interface VitalTypeObjectForm {
  value: number;
  id: number;
  userId: string;
  name: string;
  date: Date;
}

export const initialVitalState: VitalTypeObjectForm = {
  value: 0,
  id: 0,
  userId: '',
  name: '',
  date: new Date(),
}

export interface VitalSignStepsType {
  stepName: 'heartRate' | 'bodyTemp' | 'weight' | 'height';
  stepLabel: 'Heart Rate /bpm' | 'Body tempreture /℃' | 'Weight /㎏' | 'Height /㎝';
  stepUnit: 'bpm' | '℃' | 'kg' | 'cm'
  stepImage: string | StaticImageData,
}

const VitalTabs: FC<VitalSignStepsType> = (({ stepName, stepLabel, stepUnit, stepImage }) => {
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;
  const { muiVar, bounce } = useScssVar();
  const [edit, setEdit] = useState(false);
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  const theme = useTheme();
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [rows, setRow] = useState<VitalTypeObject[] | []>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const dataGridRef = useRef<any>(null)
  const perPage = 5;
  const [paginationModel, setPaginationModel] = useState({
    pageSize: perPage,
    page: 0,
  });

  const [sortModel, setSortModel] = useState<any>([
    {
      field: 'id',
      sort: 'asc',
    },
  ]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
  const [mongoFilterModel, setMongoFilterModel] = useState<DataGridMongoDBQuery>({});
  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "id",
        headerName: "ID",
        width: 100,
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        valueGetter: (params: GridValueGetterParams) => {
          return params?.row?.id
        },
      },
      {
        field: "value",
        headerName: stepLabel,
        width: 250,
        align: 'center',
        headerAlign: 'center',
        type: 'number',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().number,
        valueGetter: (params: GridValueGetterParams) => {
          return `${params?.row?.value} ${stepUnit}`
        },
      },
      {
        field: 'date',
        headerName: "Submit Date",
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        type: 'dateTime',
        sortable: true,
        searchAble: true,
        filterable: true,
        filterOperators: createCustomOperators().date,
        valueGetter: (params: GridValueGetterParams) => {
          return params.row?.date ? dayjs(params.row.date).toDate() : null;
        },
        renderCell: (data: any) => {
          const { row } = data;
          return (
            <>
              <Stack >
                <span className="user-name" style={{ justifyContent: 'center', display: 'flex', color: theme.palette.primary.main }}>{dayjs(row.date).format(`DD MMM YYYY`)}</span>
                <span style={{ justifyContent: 'center', color: theme.palette.secondary.main, display: 'flex' }}>{dayjs(row.date).format(` HH:mm:ss`)}</span>
              </Stack>
            </>
          )
        }
      },
      {
        field: "actions",
        type: 'actions',
        headerName: "Action",
        headerAlign: 'center',
        align: 'center',
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key={params.id}
            icon={
              <DeleteForever
                sx={{ color: 'crimson' }} />}
            onClick={() => {
              setDeleteId(() => ([params.row.id]))
              setShowDelete(true)
            }} label="Delete" />,
        ]
      }
    ]

  }, [stepLabel, stepUnit, theme.palette.primary.main, theme.palette.secondary.main]);
  const [deleteId, setDeleteId] = useState<GridRowId[]>([])
  const handleChangePage = (
    _event: any | null,
    newPage: number) => {
    setPaginationModel((prevState) => {
      return {
        ...prevState,
        page: newPage - 1
      }
    })
  }


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPaginationModel((prevState) => {
      var maximuPage: number = prevState.page;
      if (rowCount !== 0) {
        if ((maximuPage + 1) >= (Math.ceil(rowCount / parseInt(event.target.value, 10)))) {
          maximuPage = (Math.ceil(rowCount / parseInt(event.target.value, 10))) - 1
        }
      }
      return {
        page: maximuPage <= 0 ? 0 : maximuPage,
        pageSize: parseInt(event.target.value, 10)
      }
    })
  }

  const { filterModel, onFilterChange, } = useDataGridServerFilter();

  const handelFilterModelChange = useCallback((newFilterModel: GridFilterModel) => {
    onFilterChange(newFilterModel);
  }, [onFilterChange])


  const removeMongoFilter = (filterModel: GridFilterModel) => {
    if (filterModel.items.length == 0) { setMongoFilterModel({}) }
    const value = filterModel.items[0]?.value;
    if (!value && value == 0 && value == '') {
      setMongoFilterModel({})
    }
  }

  useEffect(() => {
    const updateDbFilter = (filterModel: GridFilterModel) => {
      const value = filterModel.items[0]?.value;
      if (value && value !== '0' && value !== '') {
        const mongoQuery = convertFilterToMongoDB(filterModel, columns);
        setMongoFilterModel(mongoQuery);
      } else {
        setMongoFilterModel({})
      }
    }
    globalFilterFunctions.applyFilters = updateDbFilter;
    removeMongoFilter(filterModel)
  }, [columns, filterModel])


  useEffect(() => {
    setTimeout(() => {
      if (dataGridRef?.current) {
        setBoxMinHeight(`${dataGridRef.current.clientHeight}px`);
      }
    }, 100);
  }, [paginationModel.pageSize, isLoading]);


  //Update page for pagination model in case last page delete or result less than page
  useEffect(() => {
    const totalCount = rowCount;
    const totalPages = Math.ceil(totalCount / paginationModel.pageSize);
    const isOutOfRange = paginationModel.page >= totalPages;

    if (rowCount !== 0) {
      if (isOutOfRange) {
        setPaginationModel((prevState: { page: number, pageSize: number }) => ({
          ...prevState,
          page: Math.max(0, totalPages - 1), // Ensures page never goes below 0
        }));
      }
    } else {
      setPaginationModel((prevState: { page: number, pageSize: number }) => ({
        ...prevState,
        page: 0, // Ensures page never goes below 0
      }));
    }
  }, [paginationModel.page, paginationModel.pageSize, rowCount])

  useEffect(() => {
    let isActive = true;
    if (isActive) {
      let userId = userProfile?._id
      if (homeSocket.current !== undefined) {
        homeSocket?.current.emit('getVitalSignForMedicalRecords', {
          userId: userId,
          vitalName: stepName,
          paginationModel,
          sortModel,
          mongoFilterModel
        });
        homeSocket.current.once('getVitalSignForMedicalRecordsReturn', (msg: {
          status: number,
          message?: string,
          vitalRecords: {
            totalRecords: number,
            vitalData: VitalTypeObject,
            _id: string;
          }[],
          totalRecords: number
        }) => {
          const { status, message } = msg;

          if (status !== 200) {
            toast.error(message || `Error ${status} find medical`, {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              transition: bounce,
              toastId: `${stepName}`,
              onClose: () => {
                setIsLoading(false)
                toast.dismiss(`${stepName}`)
              }
            });
          } else {
            const { vitalRecords, totalRecords } = msg;
            if (vitalRecords.length > 0) {
              setRowCount(totalRecords)
              let newResults: VitalTypeObject[] = []
              vitalRecords.forEach((elem) => {
                const vitalData: VitalTypeObject = elem.vitalData;
                newResults.push(vitalData)
              })
              setRow(newResults)
            } else {
              setRow([])
            }
            homeSocket.current.once(`updateVitalSignForMedicalRecords`, () => {
              setReload(!reload)
            })
            setIsLoading(false)
          }
        });
      }
    }
    return () => {
      isActive = false;
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, paginationModel, sortModel, mongoFilterModel, reload, stepName])

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue: setFormValue,
    getValues: getFormValues,
    watch,
  } = useForm({
    defaultValues: {
      ...initialVitalState,
      userId: userProfile?._id
    }
  })
  const confirmDelete = () => {


    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('vitalSignDelete', { userId: userProfile?._id, name: stepName, deleteId: deleteId })
      homeSocket.current.once('vitalSignDeleteReturn', (msg: { status: number, message: string, }) => {
        const { status, message } = msg;
        if (status !== 200) {
          toast.error(message || `Error ${status} find Vital signs`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: bounce,
            onClose: () => { }
          });
        } else {
          setReload(!reload)
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

          setTimeout(() => {
            setShowDelete(false)
            setDeleteId([])
          }, 500);
        }
      })
    }
  }

  const onSubmit = (data: any) => {
    if (homeSocket.current !== undefined) {
      homeSocket.current.emit('vitalSignsUpdate', { name: data.name, value: +data.value, userId: data.userId })
      setReload(!reload)
    }
    document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
    setTimeout(() => {
      setEdit(false)
    }, 500);
  }
  return (
    <Fragment>
      {
        isLoading ?
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <Box sx={{ minHeight: boxMinHeight }} className="dataGridOuterBox">
                  <LoadingComponent boxMinHeight={boxMinHeight} />
                </Box>
              </div>
            </div>
          </div> :
          <div className="card">
            <div ref={dataGridRef} className="tab-content schedule-cont   animate__animated animate__lightSpeedInRight">
              <Box className="dataGridOuterBox" >
                <span style={{ position: "relative" }}>
                  <Typography className="totalTypo"
                    variant='h5' align='center' gutterBottom >
                    {
                      rowCount !== 0 ?
                        `Total ${stepLabel} records: ${rowCount}` :
                        `Not  ${stepLabel} records yet`
                    }
                  </Typography>
                  <Link href=""
                    style={{ lineHeight: `25px`, margin: 0, position: 'absolute', top: 0, right: 0 }}
                    className="add-new-btn float-end"
                    onClick={(e) => {
                      e.preventDefault();
                      setEdit(true)
                      setFormValue("value", initialVitalState.value);
                      setFormValue("id", initialVitalState.id);
                      setFormValue("userId", userProfile?._id);
                      setFormValue("name", stepName);
                      setFormValue("date", initialVitalState.date);
                    }} >Add {stepLabel}</Link>
                </span>
                <div className="table-responsive" style={{ height: paginationModel?.pageSize == 5 ? 600 : 1000, width: '100%' }}>


                  <DataGrid
                    rowHeight={80}
                    paginationMode='server'
                    filterMode="server"

                    // dont mode server and handle in client side sorting toosortingMode="server"
                    sortModel={sortModel}
                    onSortModelChange={(model: GridSortModel) => {
                      if (model.length > 0) {
                        setSortModel((_prev: GridSortModel) => [...model]);
                      }
                    }}
                    sortingOrder={['desc', 'asc']}
                    filterModel={filterModel}
                    onFilterModelChange={handelFilterModelChange}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={(newModel) => {
                      setColumnVisibilityModel(newModel)
                    }}
                    loading={isLoading}
                    experimentalFeatures={{ ariaV7: true }}
                    slots={{
                      toolbar: CustomToolbar,
                      pagination: CustomPagination,
                      noResultsOverlay: CustomNoRowsOverlay,
                      noRowsOverlay: CustomNoRowsOverlay
                    }}
                    slotProps={{
                      toolbar: {
                        printOptions: { disableToolbarButton: true },
                        deleteId: deleteId,
                        deleteClicked: () => { setShowDelete(true) },
                        columnVisibilityModel: columnVisibilityModel,
                      },
                      pagination: {
                        onRowsPerPageChange: handleChangeRowsPerPage,
                        page: paginationModel.page,
                        rowsPerPage: paginationModel.pageSize,
                        onPageChange: handleChangePage,
                        count: rowCount,
                        SelectProps: {
                          inputProps: {
                            id: 'pagination-select',
                            name: 'pagination-select',
                          },
                        },
                      },
                      filterPanel: {
                        filterFormProps: {
                          deleteIconProps: {
                            sx: {
                              justifyContent: 'flex-start'
                            },
                          },
                        },
                      },
                      baseCheckbox: {
                        inputProps: {
                          name: "select-checkbox"
                        }
                      }
                    }}
                    rows={rows}
                    rowCount={rowCount}
                    columns={columns}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                      const { page, pageSize } = paginationModel
                      let start = page == 0 ? page : page * pageSize
                      let end = pageSize * (1 + page)
                      let currrenPageId = newRowSelectionModel.slice(start, end)
                      setDeleteId(() => {
                        let newState = currrenPageId.length > 0 ? [...currrenPageId] : [...newRowSelectionModel]
                        return newState
                      });
                    }}
                    rowSelectionModel={deleteId}
                    paginationModel={paginationModel}
                    pageSizeOptions={[5, 10]}
                    showCellVerticalBorder
                    showColumnVerticalBorder
                    sx={{
                      "&.MuiDataGrid-root .MuiDataGrid-row": {
                        backgroundColor:
                          false ? getSelectedBackgroundColor(
                            theme.palette.primary.dark,
                            theme.palette.mode,
                          ) : '',
                        '&:hover': {
                          backgroundColor: getSelectedHoverBackgroundColor(
                            theme.palette.primary.light,
                            theme.palette.mode,
                          ),
                        }
                      },
                      "& .MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                        marginTop: "1em",
                        marginBottom: "1em"
                      },
                      "& .MuiDataGrid-footerContainer": {
                        [theme.breakpoints.only("xs")]: {
                          justifyContent: 'center',
                          marginBottom: '2px'
                        }
                      }
                    }}
                  />
                </div>
              </Box>
            </div>
          </div>
      }
      {edit && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={() => {
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
          setTimeout(() => {
            reset();
            setEdit(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={edit}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
            setTimeout(() => {
              reset();
              setEdit(false)
            }, 500);
          }}>
          {
            <Image src={stepImage} width={35} height={35} alt='' />
          }&nbsp;
          {getFormValues('value') == 0 ? `Add new ${stepLabel}` : `Edit ${stepLabel}`}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="row form-row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <Controller
                    rules={{
                      required: "This field is required",
                      validate: (value) => value > 0 || 'Value should be greater than Zero.',
                    }}
                    name='value'
                    control={control}
                    render={(props: any) => {
                      const { field, } = props;
                      const { value } = field;
                      const { ref, onChange } = field;
                      return (
                        <NumericFormat
                          value={value !== 0 ? value : ''}
                          customInput={TextField}
                          isAllowed={(values) => {
                            const { floatValue } = values;
                            return floatValue === undefined || floatValue >= 0;
                          }}
                          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === '-' || e.key === 'e' || e.key === '+') {
                              e.preventDefault();
                              return false;
                            }
                          }}
                          onChange={onChange}
                          getInputRef={ref}
                          {...{
                            required: true,
                            id: `value`,
                            label: 'Value',
                            fullWidth: true,
                            size: 'small',
                            inputProps: {
                              autoComplete: 'off',
                              'aria-label': 'value',
                            },
                            InputProps: {
                              endAdornment: <InputAdornment position="end">
                                {stepUnit}
                              </InputAdornment>
                            },
                          }}
                          sx={{
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                              display: 'none',
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield',
                            },
                          }} />
                      )
                    }} />
                  {errors.value &&
                    <FormHelperText sx={{ color: 'crimson' }}>{errors['value']['message']}</FormHelperText>
                  }
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <Controller
                    rules={{
                      required: "This field is required",
                    }}
                    name='date'
                    control={control}
                    render={(props: any) => {
                      const { field, } = props;
                      const { value } = field;
                      const { ref, onChange } = field;
                      return (
                        <TextField
                          disabled
                          required
                          id='date'
                          label="Date"
                          size='small'
                          value={`${value ? `${dayjs(value).tz(process.env.TZ).format('YYYY MMM DD HH:mm:ss')}` : ''}`}
                          error={errors.date == undefined ? false : true}
                          helperText={errors.date && errors['date']['message'] as ReactNode}
                          fullWidth
                          ref={ref}
                          inputProps={{ style: { textTransform: 'lowercase' }, autoComplete: 'date' }}
                          onChange={(e: any) => {
                            onChange(e)
                          }}
                        />
                      )
                    }} />
                </div>
              </div>
            </div>
            <button type="submit" className="submitButton w-100" style={{ marginTop: 25 }} >
              Submit
            </button>
          </form>
        </DialogContent>
      </BootstrapDialog>}
      {showDelete && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(event, reason) => {
          if (reason == 'backdropClick') return false;
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

          setTimeout(() => {
            setShowDelete(false)
            setDeleteId([])
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={showDelete}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

            setTimeout(() => {
              setShowDelete(false)
              setDeleteId([])
            }, 500);
          }}>
          <Stack>
            <span>Delete</span>

          </Stack>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <h4 className="modal-title" style={{ display: 'flex', justifyContent: 'center' }}>Delete</h4>
          <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete {deleteId.length} record{deleteId.length == 1 ? "" : "s"}?</p>
          <span style={{ ...muiVar, display: 'flex', justifyContent: 'center' }}><button type="button" className="btnLogin mx-1"
            onClick={() => {
              confirmDelete();
            }}>Delete </button>
            <button type="button" className="btnLogout" style={muiVar}
              onClick={() => {
                document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

                setTimeout(() => {
                  setShowDelete(false)
                  setDeleteId([])
                }, 500);

              }}>Cancell</button>
          </span>
        </DialogContent>
      </BootstrapDialog>}
    </Fragment>
  );
})

export default VitalTabs;
