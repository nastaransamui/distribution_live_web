import React, { FC, Fragment, useCallback, useState } from "react";

//Mui
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container'
import DeleteForever from "@mui/icons-material/DeleteForever";
import PaidIcon from '@mui/icons-material/Paid';
import IconButton from "@mui/material/IconButton";

import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc';
import Grid from "@mui/material/Grid";

import { NumericFormat } from "react-number-format";
import Badge from "@mui/material/Badge";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Button from "@mui/material/Button";

import _, { divide } from 'lodash'

import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getGridBooleanOperators, getGridDateOperators, getGridNumericOperators, getGridStringOperators, GridColDef, GridColumnVisibilityModel, GridFilterInputValueProps, GridFilterItem, GridFilterModel, GridFilterOperator, GridRowId, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, useGridRootProps } from "@mui/x-data-grid";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/router";
import Link from "next/link";

var toBoolean = require('to-boolean');
dayjs.extend(utc);
dayjs.extend(timezone)

type InputProps = {
  dispay: string
}

type CustomToolbarPropsType = {
  deleteId: GridRowId[];
  deleteClicked: Function;
  columnVisibilityModel: GridColumnVisibilityModel;
}

export const StyledBox = styled(Container)<InputProps>(({ theme, dispay }) => ({
  border: '2px solid ',
  borderColor: theme.palette.secondary.main,
  borderRadius: 5,
  marginBottom: 5,
  minHeight: screen.height / 15.2,
  minWidth: '100%',
  display: dispay,
  '--animate-duration': '1s',
  '--animate-delay': '1s'
}));

const CustomToolbar: FC<CustomToolbarPropsType> = (props) => {
  const { deleteId, deleteClicked, columnVisibilityModel, } = props
  const router = useRouter()

  return (
    <StyledBox
      dispay="flex"
      // disableGutters
      maxWidth='xl'
    >
      <GridToolbarContainer
        sx={{ display: 'flex', minWidth: '100%', justifyContent: 'space-between' }}>
        {deleteId.length == 0 ?
          <Fragment>
            {/* */}
            <Grid container spacing={2} direction="row" sx={{ width: '100%', marginTop: 0 }}>
              <Grid item xl={6} lg={6} md={5} sm={12} xs={12}>
                <Badge badgeContent={columnVisibilityModel == undefined ? 0 :
                  Object.values(columnVisibilityModel).filter(a => !a).length} color="primary" sx={{
                    '& .MuiBadge-badge': {
                      right: 75,
                      top: 4,
                      padding: '0 4px',
                    },
                  }}>
                  <GridToolbarColumnsButton />
                </Badge>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
              </Grid>
              <Grid item xl={5} lg={6} md={6} sm={12} xs={12} sx={{
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>

              </Grid>
              <Grid item xl={4} lg={2} md={1} sm={12} xs={12} sx={{ display: "flex", justifyContent: { sm: 'flex-start', md: "flex-end" } }}>


              </Grid>
            </Grid>
          </Fragment> :
          <Fragment>
            <div className="MuiDataGrid-selectedRowCount css-de9k3v-MuiDataGrid-selectedRowCount">
              {deleteId.length} selected for {router.pathname !== "/doctors/dashboard/invoice" ? `delete.` : `update.`}

            </div>
          </Fragment>}
        {deleteId.length !== 0 &&
          <>
            {
              router.pathname !== "/doctors/dashboard/invoice" ?
                <IconButton onClick={() => { deleteClicked() }} sx={{ right: 10, position: 'absolute' }}>
                  <DeleteForever sx={{ color: 'crimson' }} />
                </IconButton> :
                <Link
                  href=""
                  className="btn btn-primary request_btn"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteClicked()
                  }}
                  style={{ lineHeight: `25px` }}
                >
                  Payment Request
                </Link>
            }
          </>
        }
      </GridToolbarContainer>

    </StyledBox >

  )
}



export default CustomToolbar;


// Define valid filter operators for each column type
const filterOperators: Record<string, GridFilterOperator[]> = {
  string: createCustomOperators().string,
  number: createCustomOperators().number,
  date: createCustomOperators().date,
  boolean: createCustomOperators().boolean,
};

const mongoDBOperators: Record<string, string> = {
  contains: "$regex",
  equals: "$eq",
  ">": "$gt",
  "<": "$lt",
  "=": "$eq",
  before: "$lt",
  after: "$gt",
  on: '$eq',
  between: "$between",
  is: "$eq",
};

export interface DataGridMongoDBQuery {
  [key: string]: { [operator: string]: any };
}

export const convertFilterToMongoDB = (filterModel: GridFilterModel, columns: GridColDef[]): DataGridMongoDBQuery => {
  return filterModel.items.reduce((query: DataGridMongoDBQuery, filter) => {
    const { field, operator, value } = filter;
    if (!mongoDBOperators[operator] || value === undefined) return query;
    // Find the column definition to determine the type
    const column = columns.find((col) => col.field === field);
    if (!column) return query;
    let parsedValue: any = value;
    // Parse the value based on the column type
    switch (column.type) {
      case 'number':
        if (operator === 'between') {
          if (Array.isArray(parsedValue) && parsedValue.length === 2) {
            const [min, max] = parsedValue.map(Number);
            if (!isNaN(min) && !isNaN(max)) {
              parsedValue = { $gte: min, $lte: max };
            }
          }
        } else {
          parsedValue = Number(value);
          if (!isNaN(parsedValue)) {
            query[field] = { [mongoDBOperators[operator]]: parsedValue };
          }
        }
        break;
      case 'date':
      case 'dateTime':
        parsedValue = dayjs(value).toDate();
        if (!dayjs(parsedValue).isValid()) return query; // Skip if parsing failed
        break;
      case 'boolean':
        if (parsedValue) {
          query[field] = { [mongoDBOperators[operator]]: parsedValue };
        }
        break;
    }
    // Handle 'contains' operator for strings
    if (operator === 'contains' && typeof parsedValue === 'string') {
      query[field] = { [mongoDBOperators[operator]]: parsedValue, $options: 'i' }; // 'i' for case-insensitive
    } else if (operator === 'between') {
      query[field] = parsedValue
    } else {
      if (operator === "before" || operator === "after" || operator === "on") {
        const localDate = dayjs(value).tz(process.env.NEXT_PUBLIC_TZ).startOf('day').format('YYYY-MM-DDT00:00:00.000Z');
        const utcDate = dayjs(localDate).tz('UTC', true).toISOString();
        query = {
          $expr: {
            [mongoDBOperators[operator]]: [
              {
                $cond: {
                  if: { $ne: [{ $type: `$${field}` }, "string"] },  // Check if the field is a date (not a string)
                  then: { $dateToString: { format: "%Y-%m-%d", date: `$${field}` } },
                  else: null, // Return null if it's an empty string or invalid date
                },
              },
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: column.type == 'dateTime' ? { $dateFromString: { dateString: utcDate } } : { $dateFromString: { dateString: localDate } }

                },
              },
            ],
          },

        }
      } else {
        query[field] = { [mongoDBOperators[operator]]: parsedValue };
      }
    }
    //Try to workaround dataGrid bug
    if (column.type == 'boolean' && typeof parsedValue == 'string') {
      return { [column['field']]: { $eq: false } }
    } else {
      return query;
    }
  }, {});
};
export const useDataGridServerFilter = () => {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });

  const onFilterChange = useCallback((newFilterModel: GridFilterModel) => {
    setFilterModel(newFilterModel);
  }, []);

  const getFilterOperators = (columnType: string) => {
    return filterOperators[columnType] || [];
  };


  return { filterModel, onFilterChange, getFilterOperators };
};

interface CustomOperators {
  string: GridFilterOperator[];
  number: GridFilterOperator[];
  date: GridFilterOperator[];
  boolean: GridFilterOperator[],
}
// export let globalApplyFilters: (filterModel: GridFilterModel) => void = () => { };
export const globalFilterFunctions = {
  applyFilters: (_filterModel: GridFilterModel) => { }
};


export function createCustomOperators(): CustomOperators {

  return {
    number: [
      {
        ...getGridNumericOperators().find((op) => op.value === '>')!,
        label: "Greater Than",
        value: '>',
        getApplyFilterFn: (filterItem: GridFilterItem, _column: GridColDef) => {
          if (!filterItem.value) {
            return null;
          }
          const filterValue = parseFloat(filterItem.value.toString());
          return (params) => {
            return params.value != null && params.value > filterValue;
          };
        },
        InputComponent: NumberFilterInput,
        InputComponentProps: { type: 'number', applyFilters: (filterModel: GridFilterModel) => { globalFilterFunctions.applyFilters(filterModel) } },
      },
      {
        ...getGridNumericOperators().find((op) => op.value === '>')!,
        label: "Less Than",
        value: '<',
        getApplyFilterFn: (filterItem: GridFilterItem, _column: GridColDef) => {
          if (!filterItem.value) {
            return null;
          }
          const filterValue = parseFloat(filterItem.value.toString());
          return (params) => {
            return params.value != null && params.value > filterValue;
          };
        },
        InputComponent: NumberFilterInput,
        InputComponentProps: { type: 'number', applyFilters: (filterModel: GridFilterModel) => { globalFilterFunctions.applyFilters(filterModel) } },
      },
      {
        ...getGridNumericOperators().find((op) => op.value === '>')!,
        label: "Equal",
        value: '=',
        getApplyFilterFn: (filterItem: GridFilterItem, _column: GridColDef) => {
          if (!filterItem.value) {
            return null;
          }
          const filterValue = parseFloat(filterItem.value.toString());
          return (params) => {
            return params.value != null && params.value > filterValue;
          };
        },
        InputComponent: NumberFilterInput,
        InputComponentProps: { type: 'number', applyFilters: (filterModel: GridFilterModel) => { globalFilterFunctions.applyFilters(filterModel) } },
      },
      {
        ...getGridNumericOperators().find((op) => op.value === '>')!,
        label: 'Between',
        value: 'between',
        getApplyFilterFn: (filterItem: GridFilterItem, _column: GridColDef) => {
          if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
            return null;
          }

          if (filterItem.value[0] == null || filterItem.value[1] == null) {
            return null;
          }
          return (params) => {
            return (
              params !== null &&
              filterItem.value[0] <= params &&
              params <= filterItem.value[1]
            );
          };
        },
        InputComponent: BetweenNumberInput,
        InputComponentProps: { type: 'number', applyFilters: (filterModel: GridFilterModel) => { globalFilterFunctions.applyFilters(filterModel) } },
      }
    ],
    date: [
      {
        ...getGridDateOperators().find((op) => op.value === 'before')!,
        label: 'Before',
        value: 'before',
        getApplyFilterFn: (filterItem: GridFilterItem, _column: GridColDef) => {
          if (!filterItem.value) {
            return null;
          }
          const filterValue = dayjs(filterItem.value).tz(process.env.NEXT_PUBLIC_TZ).format('YYYY MMM DD 00:00');
          return ({ value }) => {
            return value != null && dayjs(value).isBefore(filterValue);
          };
        },
        InputComponent: SingleDateInput,
        InputComponentProps: { type: 'date', applyFilters: (filterModel: GridFilterModel) => { globalFilterFunctions.applyFilters(filterModel) } },
      },
      {
        ...getGridDateOperators().find((op) => op.value === 'before')!,
        label: "After",
        value: 'after',
        getApplyFilterFn: (filterItem: GridFilterItem, _column: GridColDef) => {
          if (!filterItem.value) {
            return null;
          }
          const filterValue = dayjs(filterItem.value).tz(process.env.NEXT_PUBLIC_TZ).format('YYYY MMM DD 00:00');
          return ({ value }) => {
            return value != null && dayjs(value).isAfter(filterValue);
          };
        },
        InputComponent: SingleDateInput,
        InputComponentProps: { type: 'date', applyFilters: (filterModel: GridFilterModel) => { globalFilterFunctions.applyFilters(filterModel) } },
      },
      {
        ...getGridDateOperators().find((op) => op.value === 'before')!,
        label: "On",
        value: 'on',
        getApplyFilterFn: (filterItem: GridFilterItem, _column: GridColDef) => {
          if (!filterItem.value) {
            return null;
          }
          const filterValue = dayjs(filterItem.value).tz(process.env.NEXT_PUBLIC_TZ).format('YYYY MMM DD 00:00');
          return ({ value }) => {
            return value != null && dayjs(value).isSame(filterValue);
          };
        },
        InputComponent: SingleDateInput,
        InputComponentProps: { type: 'date', applyFilters: (filterModel: GridFilterModel) => { globalFilterFunctions.applyFilters(filterModel) } },
      },
    ],
    string: [
      {
        ...getGridStringOperators().find((op) => op.value === 'contains')!,
        label: "Contains",
        value: "contains",
        InputComponent: StringFilterInput,
        InputComponentProps: { type: 'text', applyFilters: (filterModel: GridFilterModel) => { globalFilterFunctions.applyFilters(filterModel) } },
      },
      {
        ...getGridStringOperators().find((op) => op.value === 'equals')!,
        label: "Equal",
        value: "equals",
        InputComponent: StringFilterInput,
        InputComponentProps: { type: 'text', applyFilters: (filterModel: GridFilterModel) => { globalFilterFunctions.applyFilters(filterModel) } },
      },
    ],
    boolean: [
      {
        ...getGridBooleanOperators().find((op) => op.value === 'is')!,
        label: "Equal",
        value: 'is',
        InputComponent: BooleanFilterInput,
        InputComponentProps: {
          type: 'boolean',
          applyFilters: (filterModel: GridFilterModel) => {
            globalFilterFunctions.applyFilters(filterModel)
          }
        },
      }
    ]
  }
}

interface AllFilterInputProps extends GridFilterInputValueProps {
  applyFilters: (filterModel: GridFilterModel) => void;
}
function NumberFilterInput(props: AllFilterInputProps) {
  const { item, applyValue, focusElementRef, applyFilters } = props;
  const numberRef: React.Ref<any> = React.useRef(null);
  React.useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      const inputElement = numberRef.current?.querySelector(`input[value="${item.value || ''}"]`);
      if (inputElement) {
        inputElement.focus();
      }
    },
  }));

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyValue({ ...item, value: event.target.value });
  }
  const rootProps = useGridRootProps();
  rootProps.filterDebounceMs = 0;
  return (
    <Fragment>
      <FormControl>
        <NumericFormat
          customInput={TextField}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            // Return false for invalid keys like '-' or any other disallowed keys
            if (e.key === '-' || e.key === 'e' || e.key === '+') {
              e.preventDefault();
              return false;
            }
          }}
          variant="standard"
          label="Value"
          onChange={handleFilterChange}
          value={item.value || ''}
          inputProps={{ 'aria-label': 'description', autoComplete: 'off' }}
          getInputRef={numberRef}
          sx={{
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              display: 'none',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
          }} />
      </FormControl>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { rootProps.filterModel && applyFilters(rootProps.filterModel) }}
          style={{ margin: '8px', float: 'right' }}
        >
          Apply
        </Button>
      </div>
    </Fragment>
  );
}

function BetweenNumberInput(props: AllFilterInputProps) {
  const rootProps = useGridRootProps();
  const { item, applyValue, focusElementRef = null, applyFilters } = props;

  const [filterValueState, setFilterValueState] = React.useState<[string, string]>(
    item.value ?? '',
  );


  React.useEffect(() => {
    const itemValue = item.value ?? [undefined, undefined];
    setFilterValueState(itemValue);
  }, [item.value]);

  const updateFilterValue = (lowerBound: string, upperBound: string) => {
    setFilterValueState([lowerBound, upperBound]);
    applyValue({ ...item, value: [lowerBound, upperBound] });
  };

  const handleUpperFilterChange: TextFieldProps['onChange'] = (event) => {
    const newUpperBound = event.target.value;
    updateFilterValue(filterValueState[0], newUpperBound);
  };
  const handleLowerFilterChange: TextFieldProps['onChange'] = (event) => {
    const newLowerBound = event.target.value;
    updateFilterValue(newLowerBound, filterValueState[1]);
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'end',
          height: 48,
        }}
      >
        <TextField
          name="lower-bound-input"
          placeholder="From"
          label="From"
          variant="standard"
          value={filterValueState[0] || ""}
          onChange={handleLowerFilterChange}
          type="number"
          inputRef={focusElementRef}
          sx={{
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              display: 'none',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
          }}
        />
        <TextField
          name="upper-bound-input"
          placeholder="To"
          label="To"
          variant="standard"
          value={filterValueState[1] || ""}
          onChange={handleUpperFilterChange}
          type="number"
          sx={{
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              display: 'none',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
          }}
        />
      </Box>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { rootProps.filterModel && applyFilters(rootProps.filterModel) }}
          style={{ margin: '8px', float: 'right' }}
        >
          Apply
        </Button>
      </div>
    </Fragment>
  );
}

function SingleDateInput(props: AllFilterInputProps) {
  const { item, applyValue, applyFilters } = props;


  const handleFilterChange = (value: Dayjs | null) => {
    if (value) {
      const formattedValue = dayjs(value).tz(process.env.NEXT_PUBLIC_TZ).format('YYYY MMM DD');
      applyValue({ ...item, value: formattedValue });
    } else {
      applyValue({ ...item, value: null });
    }
  }
  const rootProps = useGridRootProps();
  rootProps.filterDebounceMs = 0;
  return (
    <Fragment>
      <FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            value={item.value ? dayjs(item.value) : null}
            closeOnSelect
            format="DD MMM YYYY"
            onChange={handleFilterChange}
            slotProps={{
              textField: {
                variant: 'standard',
                inputProps: { value: item.value == undefined ? "Date" : dayjs(item.value).format('DD MMM YYYY') },
                fullWidth: true,
                InputLabelProps: { shrink: true },
                label: "Date"
              },

            }}
          />
        </LocalizationProvider>
      </FormControl>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { rootProps.filterModel && applyFilters(rootProps.filterModel) }}
          style={{ margin: '8px', float: 'right' }}
        >
          Apply
        </Button>
      </div>
    </Fragment>
  );
}

function StringFilterInput(props: AllFilterInputProps) {
  const { item, applyValue, focusElementRef, applyFilters } = props;
  const stringRef: React.Ref<any> = React.useRef(null);
  React.useImperativeHandle(focusElementRef, () => ({
    focus: () => {
      const inputElement = stringRef.current?.querySelector(`input[value="${item.value || ''}"]`);
      if (inputElement) {
        inputElement.focus();
      }
    },
  }));

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyValue({ ...item, value: event.target.value });
  }
  const rootProps = useGridRootProps();
  rootProps.filterDebounceMs = 0;
  return (
    <Fragment>
      <FormControl>
        <TextField
          variant="standard"
          label="Value"
          onChange={handleFilterChange}
          value={item.value || ''}
          inputProps={{ 'aria-label': 'description', autoComplete: 'off' }}
          ref={stringRef}
          sx={{
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              display: 'none',
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
          }} />
      </FormControl>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { rootProps.filterModel && applyFilters(rootProps.filterModel) }}
          style={{ margin: '8px', float: 'right' }}
        >
          Apply
        </Button>
      </div>
    </Fragment>
  );
}
function BooleanFilterInput(props: AllFilterInputProps) {
  const { item, applyValue, applyFilters } = props;
  const [selectedValue, setSelectedValue] = useState(item.value === true ? 'true' : item.value || '');
  const rootProps = useGridRootProps();
  rootProps.filterDebounceMs = 0;
  return (
    <Fragment>
      <InputLabel id="status-label" htmlFor="booleanFilter" size='small'>Value</InputLabel>
      <Select
        labelId="status-lable"
        aria-label="select status"
        variant="standard"
        fullWidth
        inputProps={{
          name: 'booleanFilter',
          id: 'booleanFilter',
          'aria-label': "select status"
        }}
        value={selectedValue}
        label="Value"
        onChange={(e) => {
          setSelectedValue(e.target.value);
          //this is because of issue with data Grid 
          if (e.target.value == 'true') {
            applyValue({ ...item, value: toBoolean(e.target.value) });
          } else {
            applyValue({ ...item, value: 'false' });
          }
        }}
      >
        <MenuItem value={'true'}>True</MenuItem>
        <MenuItem value={'false'}>False</MenuItem>
      </Select>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { rootProps.filterModel && applyFilters(rootProps.filterModel) }}
          // onClick={handleApplyClick}
          style={{ margin: '8px', float: 'right' }}
        >
          Apply
        </Button>
      </div>
    </Fragment>
  );
}