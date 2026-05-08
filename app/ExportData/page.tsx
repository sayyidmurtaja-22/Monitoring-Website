import { AvgHourBali } from "@/components/action/AvgHourBali";
import ExportClient from "./ExportClient";
import { AvgWeatherData, IntervalType } from "@/types/AvgTypes";
import { AvgHour } from "@/components/action/AvgHour";
// import prisma from "@/libs/prisma";


async function getData(timeRange:string) {
  
  const columns = await AvgHourBali(timeRange);
  return columns
}

export default async function ExportData({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  
  const query = await searchParams;
  const timeRange = Array.isArray(query.timeRange)
  ? query.timeRange[0]
  : query.timeRange;

  const fromParam = query.from as string | undefined;
  const toParam = query.to as string | undefined;
  const intervalParam = query.interval as IntervalType | undefined;

  let from : Date;
  let to : Date;

  if (fromParam && toParam ) {
    from = new Date ( `${fromParam}T17:00:00Z` );
    to = new Date ( `${toParam}T16:59:59Z` );
  }

  let avgData : AvgWeatherData[] =[];

  try{
    const [data, avg] = await promises.all([
      getData({from, to}),
      AvgHour({from,to, interval}),
    ])

    avgData= Array.isArray(avg)? avg : [];
  }catch(error) {
    console.group("error", error)
  }

  const data = await getData(timeRange!)

  return (
    <div>
      <ExportClient data={data} avgData={avgData}/>
    </div>
  );
}
