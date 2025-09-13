import { DoctorsTimeSlotType, AvailableType } from "@/components/DoctorDashboardSections/ScheduleTiming";
import { AppointmentReservationType } from "@/components/DoctorsSections/CheckOut/PaymentSuccess";
import { DataGridMongoDBQuery, useDataGridServerFilter } from "@/components/shared/CustomToolbar";
import { GridColumnVisibilityModel, GridFilterModel, } from "@mui/x-data-grid";
import { GridSortItem } from "@mui/x-data-grid/models/gridSortModel";
import React, { createContext, useContext, useRef, useState } from "react";

import { Control, useFieldArray, useForm, UseFormReturn } from "react-hook-form";


interface TimeSlotContextType {
  morningCheck: { [key: string]: boolean };
  setMorningCheck: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  afterNoonCheck: { [key: string]: boolean };
  setAfterNoonCheck: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  eveningCheck: { [key: string]: boolean };
  setEveningCheck: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isPeriodExist: { [key: string]: boolean };
  setIsPeriodExist: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  timeSlot: { [key: string]: number };
  setTimeSlot: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  calendarValue: any;
  setCalendarValue: React.Dispatch<React.SetStateAction<any>>;
  doctorAvailableTimeSlot: DoctorsTimeSlotType | null;
  setDoctorAvailableTimeSlot: React.Dispatch<React.SetStateAction<DoctorsTimeSlotType | null>>;
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  editDaySlot: AvailableType | null;
  setEditDaySlot: React.Dispatch<React.SetStateAction<AvailableType | null>>;
  formMethods: UseFormReturn<any>;
  control: Control<any>;
  handleSubmit: UseFormReturn<any>["handleSubmit"];
  clearErrors: UseFormReturn<any>["clearErrors"];
  errors: UseFormReturn<any>["formState"]["errors"];
  setFormValue: UseFormReturn<any>["setValue"];
  setError: UseFormReturn<any>["setError"];
  watch: UseFormReturn<any>["watch"];
  morningFields: any[];
  appendMorning: (value: any) => void;
  removeMorning: () => void;
  replaceMorning: (value: any) => void;
  updateMorning: (index: number, value: any) => void;

  afternoonFields: any[];
  appendAfternoon: (value: any) => void;
  removeAfternoon: () => void;
  replaceAfternoon: (value: any) => void;
  updateAfternoon: (index: number, value: any) => void;

  eveningFields: any[];
  appendEvening: (value: any) => void;
  removeEvening: () => void;
  replaceEvening: (value: any) => void;
  updateEvening: (index: number, value: any) => void;
  perPage: number;
  paginationModel: { pageSize: number, page: number };
  setPaginationModel: React.Dispatch<React.SetStateAction<{ pageSize: number, page: number }>>;
  dataGridRef: React.RefObject<HTMLDivElement>;
  sortModel: GridSortItem[];
  setSortModel: React.Dispatch<React.SetStateAction<GridSortItem[]>>;
  boxMinHeight: string;
  setBoxMinHeight: React.Dispatch<React.SetStateAction<string>>;
  columnVisibilityModel: GridColumnVisibilityModel;
  setColumnVisibilityModel: React.Dispatch<React.SetStateAction<GridColumnVisibilityModel>>;
  mongoFilterModel: DataGridMongoDBQuery;
  setMongoFilterModel: React.Dispatch<React.SetStateAction<DataGridMongoDBQuery>>;
  filterModel: GridFilterModel;
  onFilterChange: (newFilterModel: GridFilterModel) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  rows: AppointmentReservationType[];
  setRows: React.Dispatch<React.SetStateAction<AppointmentReservationType[]>>;
  rowCount: number;
  setRowCount: React.Dispatch<React.SetStateAction<number>>;
}
const TimeSlotContext = createContext<TimeSlotContextType | undefined>(undefined);

export const TimeSlotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [morningCheck, setMorningCheck] = useState<{ [key: string]: boolean }>({});
  const [afterNoonCheck, setAfterNoonCheck] = useState<{ [key: string]: boolean }>({});
  const [eveningCheck, setEveningCheck] = useState<{ [key: string]: boolean }>({});
  const [isPeriodExist, setIsPeriodExist] = useState<{ [key: string]: boolean }>({});
  const [timeSlot, setTimeSlot] = useState<{ [key: string]: number }>({});
  const [calendarValue, setCalendarValue] = useState<any>()
  const [doctorAvailableTimeSlot, setDoctorAvailableTimeSlot] = useState<DoctorsTimeSlotType | null>(null)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [tabIndex, setTabIndex] = useState(0);
  const [editDaySlot, setEditDaySlot] = useState<AvailableType | null>(null)
  const formMethods: UseFormReturn = useForm({});
  const { control, handleSubmit, clearErrors, formState: { errors }, setValue: setFormValue, setError, watch } = formMethods;

  const { fields: morningFields, append: appendMorning, remove: removeMorning, replace: replaceMorning, update: updateMorning } = useFieldArray({ control, name: "morning" });
  const { fields: afternoonFields, append: appendAfternoon, remove: removeAfternoon, replace: replaceAfternoon, update: updateAfternoon } = useFieldArray({ control, name: "afternoon" });
  const { fields: eveningFields, append: appendEvening, remove: removeEvening, replace: replaceEvening, update: updateEvening } = useFieldArray({ control, name: "evening" });
  const perPage = 5;
  const dataGridRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false)
  const [rows, setRows] = useState<AppointmentReservationType[] | []>([])
  const [rowCount, setRowCount] = useState<number>(0)

  // Reservartion datagrid states
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
  const [boxMinHeight, setBoxMinHeight] = useState<string>('500px')
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
  const [mongoFilterModel, setMongoFilterModel] = useState<DataGridMongoDBQuery>({});

  const { filterModel, onFilterChange, } = useDataGridServerFilter();




  return (
    <TimeSlotContext.Provider
      value={{
        morningCheck,
        setMorningCheck,
        afterNoonCheck,
        setAfterNoonCheck,
        eveningCheck,
        setEveningCheck,
        isPeriodExist,
        setIsPeriodExist,
        timeSlot,
        setTimeSlot,
        calendarValue,
        setCalendarValue,
        doctorAvailableTimeSlot,
        setDoctorAvailableTimeSlot,
        showDialog,
        setShowDialog,
        tabIndex,
        setTabIndex,
        editDaySlot,
        setEditDaySlot,
        formMethods,
        control,
        handleSubmit,
        clearErrors,
        setError,
        watch,
        errors,
        setFormValue,
        morningFields,
        appendMorning,
        removeMorning,
        replaceMorning,
        updateMorning,
        afternoonFields,
        appendAfternoon,
        removeAfternoon,
        replaceAfternoon,
        updateAfternoon,
        eveningFields,
        appendEvening,
        removeEvening,
        replaceEvening,
        updateEvening,
        perPage,
        paginationModel,
        setPaginationModel,
        dataGridRef,
        sortModel,
        setSortModel,
        boxMinHeight,
        setBoxMinHeight,
        columnVisibilityModel,
        setColumnVisibilityModel,
        mongoFilterModel,
        setMongoFilterModel,
        filterModel,
        onFilterChange,
        isLoading,
        setIsLoading,
        reload,
        setReload,
        rows,
        setRows,
        rowCount,
        setRowCount,
      }}
    >
      {children}
    </TimeSlotContext.Provider>
  );
};

export const useTimeSlot = (): TimeSlotContextType => {
  const context = useContext(TimeSlotContext);
  if (!context) {
    throw new Error("useTimeSlot must be used within a TimeSlotProvider");
  }
  return context;
};