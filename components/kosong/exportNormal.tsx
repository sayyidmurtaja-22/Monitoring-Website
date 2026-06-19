

const data1 = [
    {id:1, value:"halo"},
    {id:2, value:"hi"},
    {id:3, value:"hayo"}
]

const header = [ "no", "jawaban"]

 export default function Coba () {

 const handleCoba = () => {
    
  const rows = data1.map(item => [
        item.id,
        item.value,
    ])

    const csvHeader  = [header,... rows].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvHeader], {type: "text/csv;charset=utf-8;"  });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', 'download.csv');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  };

    
    return (
    <button
    id="downloadButton"
     onClick={handleCoba}>Export</button>
    );
    
}
