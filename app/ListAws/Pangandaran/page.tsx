import { ChartPie } from "@/components/Chart/PieChart";
import WindRose from "@/components/Chart/WindRose";

const Page = () => {
    return (
        <>
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 w-full">
        <WindRose />
        </div>
        </>
    );
}

export default Page;