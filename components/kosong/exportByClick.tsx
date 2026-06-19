import { dataTool } from "echarts";
import React, { useState } from "react";

export default function ExportByClick() {
  const data1 = [
    { id: 1, value: "mama" },
    { id: 2, value: "mimi" },
    { id: 3, value: "mumu" },
  ];
  const data2 = [
    { id: 1, value: "baba" },
    { id: 2, value: "bibi" },
    { id: 3, value: "bobo" },
  ];
  const data3 = [
    { id: 1, value: "nana" },
    { id: 2, value: "nini" },
    { id: 3, value: "nunu" },
  ];

  const header = ["no", "jawaban"];
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isButton, setIsButton] = useState(false);
  console.log("ischecked", [isChecked, setIsChecked]);

  const handleCheckbox = (event: any) => {
    console.log("handle", handleCheckbox);
    const status = event.target.checked;
    console.log("event");
    setIsChecked(status);
    console.log(status);
    if (!status) {
      return;
    } else {
        setIsChecked(true)
    }
  };
  console.log("handle", handleCheckbox);

  const handleCheckbox3 = (event: any) => {
    console.log("handle", handleCheckbox);
    const status = event.target.checked;
    console.log("event");
    setIsChecked3(status);
    console.log(status);
    if (!status) {
      return;
    } else {
    setIsChecked3(true)
    }
  };

  const handle = (event: any) => {
    const status = event.target.checked;
    console.log("event");
    setIsChecked2(status);
    if (!status) {
      return;
    } else {
      setIsChecked2(true)
    }
  };

  const handlebutton = () => {
    
    setIsButton(true);

    if (isButton) {
      if(isChecked2 && isChecked && isChecked3 === true){
        downloadcsv2()
        downloadcsv()
        downloadcsv3()
      }
    }
  };

  const downloadcsv3 = () => {
    const rows = data3.map((item) => [item.id, item.value]);
    const csvHeader = [header, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvHeader], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "download.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadcsv = () => {
    const rows = data1.map((item) => [item.id, item.value]);
    console.log("rows", rows);
    const csvHeader = [header, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvHeader], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "download.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadcsv2 = () => {
    const rows = data2.map((item) => [item.id, item.value]);
    console.log("rows", rows);
    const csvHeader = [header, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvHeader], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "download.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div>
        <label>
          <input
            type="checkbox"
            id="downloadCheck"
            checked={isChecked}
            onChange={handleCheckbox}
          />
          <input
            type="checkbox"
            id="downloadCheck1"
            checked={isChecked2}
            onClick={handle}
          />
          <br></br>
          <input
            type="checkbox"
            id="downloadCheck2"
            checked={isChecked3}
            onClick={handleCheckbox3}
          />
        </label>
      </div>
      <button onClick={handlebutton}>Download Csv</button>
    </>
  );
}
