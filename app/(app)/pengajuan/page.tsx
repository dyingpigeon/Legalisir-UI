// app/(app)/pengajuan/page.tsx
import { Suspense } from 'react';
import PengajuanContent from './pengajuan-content';
import { permohonanService } from '@/lib/api/permohonan';
import { headers } from 'next/headers';

export default async function PengajuanPage() {
  try {
    // Dapatkan headers dari request user
    const headersList = await headers();
    
    // Gunakan metode server dengan forwarding headers
    const initialData = await permohonanService.getAllServer(headersList);
    
    // Debug log
    console.log('Server fetched data:', initialData.length, 'items');
    
    return (
      <Suspense fallback={<LoadingSkeleton />}>
        <PengajuanContent initialData={initialData} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in PengajuanPage:', error);
    
    // Fallback dengan empty data
    return <PengajuanContent initialData={[]} />;
  }
}

function LoadingSkeleton() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
        
        {/* Table Skeleton */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded mb-3"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}