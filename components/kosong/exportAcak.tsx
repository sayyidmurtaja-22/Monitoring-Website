"use client";
import { useState } from "react";

const data1 = [// suatu kumpulan array yang berisikan kunci dan nilai 
  { id: 1, value: "mas" },
  { id: 2, value: "mis" },
  { id: 3, value: "mus" },
];
const data2 = [// suatu kumpulan array of object yang berisikan kunci dan nilai
  { id: 1, value: "halo" },
  { id: 2, value: "hayo" },
  { id: 3, value: "hi" },
  { id: 4, value: "hu" },
];
const data3 = [
  { id: 1, value: "saya" },
  { id: 2, value: "suma" },
  { id: 3, value: "sama" },
  { id: 4, value: "sumi" },
  { id: 5, value: "sami" },
];

export default function Gabungan() {
  const [ischecked, setChecked] = useState(false);// usestate ini terdiri dari index dari sebuah array yang panjang nya hanya 2 yaitu 0 dan 1,
  //jika 0 artinya element penyimpan state, dan 1 adalah fungsi yang di gunakan untuk mengubah state
  // kenapa usestate selalu di bungkus dengan menggunakan kurung siku, di karenakan sebuah fungsi  usestate mengembalikan sebuah array dengan 2 argument 

  console.log("tipe useState", setChecked)

  const Randomizeitem = (item: any) => {
    return item[Math.floor(Math.random() * item.length)];
  };
  console.log("RandomizeItem tipe nya", typeof Randomizeitem)

  // fungsi untuk melakukan pengacakan string di dalam array
  
  const handlecheckbox = (event: any) => {
    const checkedstatus = event.target.checked
    setChecked(checkedstatus);
    
   if (checkedstatus === true) {
    return console.log("ini teks disini ")
   }}

    const handleGabungan = () => {
      const generateRows = []; // menyediakan array kosong
      
      for (let i = 0; i < 3; i++) {
        const item1 = Randomizeitem(data1); //melakukan pengacakan untuk tiap array nya
        const item2 = Randomizeitem(data2);
        const item3 = Randomizeitem(data3);
        
        generateRows.push({
          // memasukan nya ke array kosong
          kolom1: item1.value,
          kolom2: item2.value,
          kolom3: item3.value,
          kolom4: item3.value,
        });
      }
      

      const csvHeader = "kolom 1, kolom 2, kolom 3, Kolom 4 \n"; // untk menentukan header dan \n untuk membuat baris baru
      const csvRows = generateRows
        .map(
          (row) =>
            `"${row.kolom1}", "${row.kolom2}", "${row.kolom3}","${row.kolom4}"`,
        ) // merender hasil array yang sudah di acak dan
        .join("\n");

      const csvString = csvHeader + csvRows;

      const blob = new Blob([csvString], {
        type: "text/csv;charset=utf-8,Kolom 1, Kolom 2, Kolom 3, Kolom 4\n",
      });
      console.log("new Blob", blob);

      const url = URL.createObjectURL(blob);// suatu keadaan ketika kita memaksakan untuk memasukan string ke dalam fungsi yang hanya menerima object atau file media 
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data_acak.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return (
        <div>
      <div className="flex items-center justify-center">
        <button onClick={handleGabungan}>Export Acak</button>
      </div>
      <div>
        <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={ischecked}
          onChange={handlecheckbox}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span>Saya setuju dengan syarat dan ketentuan</span>
      </label>
      </div>
        </div>
        
    );
  };

