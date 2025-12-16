// app/dashboard/page.tsx
import DashboardContent from "./pengajuan-content";
import { fetchPermohonanData } from "./actions";

export default async function DashboardPage() {
  // Fetch data di server
  const data = await fetchPermohonanData();
  
  return <DashboardContent initialData={data} />;
}