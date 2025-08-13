import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DateSelector() {
  const [value, setValue] = useState(null); // value será um objeto Date

  return (
    <div>
      <label htmlFor="example-datepicker">Insira a data</label>
      <DatePicker
        id="example-datepicker"
        selected={value}
        onChange={(date) => setValue(date)}
        className="form-control mb-4"
        dateFormat="dd-MM-yyyy"
      />
      
    </div>
  );
}

export default DateSelector;
