import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DatePickerValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));

  return (
    
      <DatePicker
        label="Controlled picker"
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
 
  );
}
