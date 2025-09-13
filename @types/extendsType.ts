import type {
  GridColDef as MUIGridColDef,
  GridColType,
} from "@mui/x-data-grid";
type AddSearch = {
  searchAble: boolean;
};

type LooseGridColDef = Omit<MUIGridColDef, "type"> & { type?: GridColType };

export type GridColDefWithSearchAble = LooseGridColDef & AddSearch;
