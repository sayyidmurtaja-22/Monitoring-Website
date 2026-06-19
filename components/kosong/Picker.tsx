import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";


export function Picker() {
  const [Range, setRange] = useState<any>();
  const [dataProduct, setDataProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function dataAcces() {
      try {
        const json: any[] = [];

        setDataProduct(json);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    }

    dataAcces();
  }, []);

  if (loading) <p> loading....</p>;

  return (
    <div>
      <DayPicker
        animate
        mode="range"
        min={1}
        max={90}
        selected={Range}
        onSelect={setRange}
        resetOnSelect
        required
      />
      {dataProduct.map((item: any, i) => (
        <li key={i}> {item.avg_e_Avg}/</li>
      ))}
    </div>
  );
}
