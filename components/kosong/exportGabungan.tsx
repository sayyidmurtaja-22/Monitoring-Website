
'use client'
import { useState } from "react";

const data1 = [
  { id: 1, value: "baba" },
  { id: 2, value: "bibi" },
  { id: 3, value: "bubu" },
];

const header = ["no", "jawaban"];
//  const [product1, setProduct] = useState([
//     { id: 1, value: "mama" },
//     { id: 2, value: "mimi" },
//     { id: 3, value: "mumu" },
//   ]);

export function ExportGabungan() {


  const [dataProduct, setDataProduct] = useState(false);
  const [cekbox, setCekbox] = useState(false);
  
  
  const baru =data1.filter(e => e.id === 3)
  console.log("baru", baru)
  
  const handleCekbox = (event) => {
    const status = event.target.checked;
    setCekbox(status);
    if (!status) {
      return;
    } else {
      setCekbox(true);
      console.log("nilai dari cekbox pertama:", status);
    }
  };
  
  
  
  // const [selectedMaster] = useState ([
    //   { id: 1, name: "Perangkat A", status: "Active", value: 100 },
    //   { id: 2, name: "Perangkat B", status: "Inactive", value: 200 },
    //   { id: 3, name: "Perangkat C", status: "Active", value: 300 },
    // ]);
    // const [selectedParams, setSelectedParams] = useState<string[]>([])
    
    // const handleselect = (id:any) => {
      //   setSelectedParams((prev) => prev.includes(id)
      //   ? prev.filter((i) => i !== id)
      //   : [...prev, id]
      // )
      // }
      
  
    
    const nisted =[
      ["baba","bibi"],
      ["baba","bibi"],
      ["caca","cici", "cucu"]
    ]
    // const [selected,setSelected] = useState([]);
    
    
    
    const hasil = data1.map((item) => ([
      item.id,
      item.value
    ]))
    
    console.log("hasil", hasil)
    
    
    
    // const handleBtn = () => {
      //   setDataProduct(true);
      //   if (dataProduct === true) {
        //     if (cekbox === true) {
          //       console.log("ini adalah nilai state dari cekbox:", cekbox);
          //       downloadCSv();
          //     }
          //   }
          // };
          
          
          const downloadCSv = () => {
            const rows = data1.map((item) => [item.id, item.value]);
            const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
            const stringy = JSON.stringify(nisted)
            const dataKumpulan = nisted.map((item) => item.join(',')).join('\n')
            const coba = nisted.map((item) => item.join(',')).join('\n');
            const blob = new Blob ([coba], {type: 'text/csv;charset=utf-8;'});
            //   const blob = new Blob([dataKumpulan], 
            // { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", ".csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          };
          
          return (
            <>
    <div>

      <label>
        Parameter
        <input type="checkbox" checked={cekbox} onChange={handleCekbox} />
      </label>
      <br></br>
      {/* <button onClick={handleBtn}>Download CSv</button> */}
    </div>
    </>
  );
}
  
  