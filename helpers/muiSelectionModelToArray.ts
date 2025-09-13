import { GridRowSelectionModel } from "@mui/x-data-grid";

// helper: convert selection model to array of ids
export default function muiSelectionModelToArray(
  model: GridRowSelectionModel
): string[] {
  if (Array.isArray(model)) {
    return model as string[];
  }

  if (model?.type === "include") {
    return Array.from(model.ids) as string[];
  }
  return [];
}
