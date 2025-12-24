// app/(app)/pengajuan/page.tsx
import { Suspense } from 'react';
import PengajuanContent from './pengajuan-content';
import { permohonanService } from '@/lib/api/permohonan';
import { cookies } from 'next/headers';
import Loading from '@/app/(app)/Loading'; // Import Loading komponen

export default async function PengajuanPage() {
  try {
    // Dapatkan access token dari cookies (sesuai sistem auth Sanctum)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    
    // Gunakan metode server dengan access token
    const initialData = await permohonanService.getAllServer(accessToken);
    
    console.log('Server fetched data:', initialData.length, 'items');
    
    return (
      <Suspense fallback={<Loading />}> {/* Gunakan Loading komponen */}
        <PengajuanContent initialData={initialData} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in PengajuanPage:', error);
    
    // Fallback dengan empty data
    return <PengajuanContent initialData={[]} />;
  }
}

// HAPUS fungsi LoadingSkeleton karena sudah ada komponen Loading