import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { AvgHour } from "../../app/ListAws/Padang/AvgHour";

export function Picker() {
  const [Range, setRange] = useState<Date>();
  const [dataProduct, setDataProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function dataAcces() {
      try {
        const res = await AvgHour;
        const json = await res.json();

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
      {dataProduct.map((item) => (
        <li key={item.}> {item.avg_e_Avg}/</li>
      ))}
    </div>
  );
}
