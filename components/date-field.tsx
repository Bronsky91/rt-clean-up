import styles from "../styles/DataCleanupPage.module.scss";
import React from "react";
import DatePicker from "react-datepicker";
import { getYear, getMonth, parse } from "date-fns";

export default function DateField(props) {
  const range = (start, end) => {
    return new Array(end - start).fill(0).map((d, i) => i + start);
  };
  const years = range(1900, getYear(new Date()) + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // LocalStorage saves the date as a string so need to convert back to Date object
  const dateValue = props.fieldValue ? new Date(props.fieldValue) : null;

  return (
    <div className={styles.formField}>
      <label className={styles.formLabel}>{props.label}</label>
      <DatePicker
        dateFormat="MM/dd/yyyy"
        selected={dateValue}
        onChange={(date) => props.handleDateChange(date, props.fieldName)}
        renderCustomHeader={({ date, changeYear, changeMonth }) => {
          console.log(getMonth(date));
          return (
            <div
              style={{
                margin: 10,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <select
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(value)}
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        }}
      />
    </div>
  );
}
