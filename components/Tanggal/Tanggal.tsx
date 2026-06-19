export default function TanggalSekarang() {
  const sekarang = new Date();

  const ini = "ini hari selasa";

  const formated = ini.split(",")
  console.log("formated", formated);
  console.log("sekarang", sekarang);
  return <div>
    {sekarang.toString()}
  </div>;
}
