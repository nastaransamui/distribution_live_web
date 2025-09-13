import dayjs from "dayjs";
import preciseDiff from "dayjs-precise-range"; // or your plugin import
dayjs.extend(preciseDiff);

export default function ageParts(dob?: "" | Date | null) {
  if (dob == "") {
    return { years: 0, months: 0, days: 0 };
  }

  const dobDay = dayjs(dob); // now a Dayjs
  if (!dobDay.isValid()) {
    return { years: 0, months: 0, days: 0 };
  }

  // preciseDiff expects Dayjs arguments
  const diff = dayjs.preciseDiff(dobDay, dayjs(), true) as {
    years: number;
    months: number;
    days: number;
  };

  return diff;
}
