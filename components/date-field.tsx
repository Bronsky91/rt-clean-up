import styles from "../styles/DataCleanupPage.module.scss";
import React from "react";
import DatePicker from "react-datepicker";
import { getYear, getMonth, parse } from "date-fns";
import { datestringToDate } from "../utils/date-conversion";

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

  return (
    <div className={`${styles.mergedField} ${styles.margined}`}>
      <label className={styles.mergedLabel}>{props.label}</label>
      <DatePicker
        className={styles.mergedInput}
        dateFormat="yyyy-MM-dd"
        selected={datestringToDate(props.fieldValue)} // Redtail works with this date as a yyyy-MM-dd string, so need to convert to Date object
        onChange={(date) => props.handleDateChange(date, props.fieldName)}
        renderCustomHeader={({ date, changeYear, changeMonth }) => {
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
