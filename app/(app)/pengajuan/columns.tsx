// app/dashboard/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Permohonan } from "@/types/permohonan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  X,
  Eye,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Printer,
  Share2,
  Copy,
  MoreHorizontal,
  AlertCircle,
  Loader2,
  User,
  Calendar,
  FileDigit,
  BookOpen,
  Mail,
  Phone,
  Clock,
  File,
  FileCheck,
} from "lucide-react";
import { useState } from "react";

// Status mapping - Fallback jika statusText tidak ada
const getStatusText = (status: number, statusText?: string): string => {
  if (statusText) return statusText;
  
  switch (status) {
    case 1: return "Menunggu";
    case 2: return "Diverifikasi";
    case 3: return "Ditandatangani";
    case 4: return "Siap Diambil";
    case 5: return "Sudah Diambil";
    case 6: return "Ditolak";
    case 7: return "Dibatalkan";
    default: return "Menunggu";
  }
};

const getStatusColor = (status: number): string => {
  switch (status) {
    case 1: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case 2: return "bg-blue-100 text-blue-800 border-blue-200";
    case 3: return "bg-purple-100 text-purple-800 border-purple-200";
    case 4: return "bg-green-100 text-green-800 border-green-200";
    case 5: return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case 6: return "bg-red-100 text-red-800 border-red-200";
    case 7: return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Komponen PDF Viewer
function PDFViewer({ 
  pdfUrl, 
  title,
  fallbackText = "Dokumen tidak tersedia"
}: { 
  pdfUrl: string; 
  title: string;
  fallbackText?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Cek jika URL kosong atau tidak valid
  if (!pdfUrl || pdfUrl === "") {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 border rounded-lg p-6">
        <File className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-700 font-medium mb-2">Dokumen tidak tersedia</p>
        <p className="text-gray-500 text-sm text-center">
          {fallbackText}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] border rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Memuat dokumen...</p>
        </div>
      )}
      
      {error ? (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
          <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
          <p className="text-gray-700 font-medium mb-1">Gagal memuat dokumen</p>
          <p className="text-gray-500 text-sm text-center mb-4">
            Dokumen tidak dapat ditampilkan. Silakan download untuk melihat.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setError(false);
              setIsLoading(true);
            }}
          >
            Coba Lagi
          </Button>
        </div>
      ) : (
        <embed
          src={`${pdfUrl}#toolbar=0&navpanes=0`}
          type="application/pdf"
          width="100%"
          height="100%"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          title={title}
        />
      )}
      
      <div className="absolute top-3 right-3 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1 bg-white/95 backdrop-blur-sm shadow-sm"
          onClick={() => window.open(pdfUrl, '_blank')}
          disabled={!pdfUrl}
        >
          <Download className="h-3.5 w-3.5" />
          Buka Baru
        </Button>
      </div>
    </div>
  );
}

// Kolom-kolom DataTable
export const columns: ColumnDef<Permohonan>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "userName",
    header: "Nama Pemohon",
    cell: ({ row }) => {
      const permohonan = row.original;
      return <div className="font-medium">{permohonan.userName || "-"}</div>;
    },
  },
  {
    accessorKey: "username",
    header: "NIM",
    cell: ({ row }) => {
      const permohonan = row.original;
      return <div className="font-mono">{permohonan.username}</div>;
    },
  },
  {
    accessorKey: "nomorIjazah",
    header: "Nomor Ijazah",
    cell: ({ row }) => {
      const permohonan = row.original;
      return <div className="font-mono">{permohonan.nomorIjazah}</div>;
    },
  },
  {
    accessorKey: "keperluan",
    header: "Keperluan",
    cell: ({ row }) => {
      const permohonan = row.original;
      return (
        <div className="max-w-[200px] truncate" title={permohonan.keperluan}>
          {permohonan.keperluan}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const permohonan = row.original;
      return (
        <Badge className={getStatusColor(permohonan.status)}>
          {getStatusText(permohonan.status, permohonan.statusText)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => {
      const permohonan = row.original;
      const date = new Date(permohonan.createdAt);
      return <div>{date.toLocaleDateString("id-ID")}</div>;
    },
  },
  {
    accessorKey: "jumlahLembar",
    header: "Lembar",
    cell: ({ row }) => {
      const permohonan = row.original;
      return <div className="text-center">{permohonan.jumlahLembar}</div>;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const permohonan = row.original;
      const [alasanTolak, setAlasanTolak] = useState("");
      const [isProcessing, setIsProcessing] = useState(false);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [successMessage, setSuccessMessage] = useState<string | null>(null);
      const [errorMessage, setErrorMessage] = useState<string | null>(null);

      // Tentukan URL PDF yang akan ditampilkan
      // Prioritas: file_ijazah_verified > file_url > file
      const pdfUrl = permohonan.file_ijazah_verified || permohonan.file_url || permohonan.file;
      
      // Nama file untuk download
      const fileName = `ijazah_${permohonan.nomorIjazah}_${permohonan.username}.pdf`;

      const showMessage = (type: 'success' | 'error', message: string) => {
        if (type === 'success') {
          setSuccessMessage(message);
          setErrorMessage(null);
        } else {
          setErrorMessage(message);
          setSuccessMessage(null);
        }
        
        // Auto clear message setelah 3 detik
        setTimeout(() => {
          setSuccessMessage(null);
          setErrorMessage(null);
        }, 3000);
      };

      const handleVerifikasi = async () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        setSuccessMessage(null);
        setErrorMessage(null);
        
        try {
          // API call untuk verifikasi
          const response = await fetch(`/api/permohonan/${permohonan.id}/verifikasi`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            showMessage('success', `Permohonan #${permohonan.id} berhasil diverifikasi`);
            setIsDialogOpen(false);
            // Refresh data
            window.location.reload();
          } else {
            throw new Error(data.message || 'Gagal memverifikasi');
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Terjadi kesalahan saat memverifikasi";
          showMessage('error', errorMsg);
        } finally {
          setIsProcessing(false);
        }
      };

      const handleTolak = async () => {
        if (isProcessing) return;
        
        if (!alasanTolak.trim()) {
          showMessage('error', "Harap masukkan alasan penolakan");
          return;
        }

        setIsProcessing(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
          // API call untuk menolak
          const response = await fetch(`/api/permohonan/${permohonan.id}/tolak`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              alasan: alasanTolak,
              catatan: alasanTolak 
            }),
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            showMessage('success', `Permohonan #${permohonan.id} telah ditolak`);
            setIsDialogOpen(false);
            setAlasanTolak("");
            // Refresh data
            window.location.reload();
          } else {
            throw new Error(data.message || 'Gagal menolak permohonan');
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Terjadi kesalahan saat menolak permohonan";
          showMessage('error', errorMsg);
        } finally {
          setIsProcessing(false);
        }
      };

      const handleDownload = (fileUrl: string, filename: string) => {
        if (!fileUrl) {
          showMessage('error', "File tidak tersedia untuk didownload");
          return;
        }

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showMessage('success', "Dokumen sedang didownload...");
      };

      const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      };

      const formatDateTime = (dateString: string): string => {
        return new Date(dateString).toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      return (
        <>
          {/* Messages */}
          {successMessage && (
            <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg max-w-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>{successMessage}</span>
                </div>
              </div>
            </div>
          )}
          
          {errorMessage && (
            <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg max-w-md">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{errorMessage}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tombol untuk membuka dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Eye className="h-3.5 w-3.5" />
                Tinjau
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tinjau Permohonan #{permohonan.id}
                </DialogTitle>
                <DialogDescription>
                  Pratinjau dokumen dan kelola status permohonan
                </DialogDescription>
              </DialogHeader>

              {/* Status Messages dalam Dialog */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>{successMessage}</span>
                  </div>
                </div>
              )}
              
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <Tabs defaultValue="preview" className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Pratinjau Dokumen</TabsTrigger>
                  <TabsTrigger value="info">Informasi Permohonan</TabsTrigger>
                  <TabsTrigger value="actions">Tindakan</TabsTrigger>
                </TabsList>
                
                {/* Konten Tab */}
                <div className="flex-1 overflow-auto mt-4">
                  {/* Tab 1: PDF Preview */}
                  <TabsContent value="preview" className="h-full m-0">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Dokumen Ijazah</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            {permohonan.file_ijazah_verified ? (
                              <>
                                <FileCheck className="h-4 w-4 text-green-600" />
                                <span>File Verified</span>
                              </>
                            ) : (
                              <>
                                <File className="h-4 w-4 text-gray-400" />
                                <span>File Upload</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(pdfUrl, fileName)}
                            className="gap-1"
                            disabled={isProcessing || !pdfUrl}
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(pdfUrl, '_blank')}
                            className="gap-1"
                            disabled={isProcessing || !pdfUrl}
                          >
                            <Printer className="h-3.5 w-3.5" />
                            Cetak
                          </Button>
                        </div>
                      </div>
                      <PDFViewer 
                        pdfUrl={pdfUrl} 
                        title={`Ijazah - ${permohonan.nomorIjazah}`}
                        fallbackText="Dokumen belum diupload atau sedang diproses"
                      />
                    </div>
                  </TabsContent>

                  {/* Tab 2: Informasi Permohonan */}
                  <TabsContent value="info" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Data Pemohon
                          </Label>
                          <div className="mt-2 space-y-3">
                            <div className="p-3 bg-white border rounded-lg">
                              <p className="font-medium text-lg">{permohonan.userName || "-"}</p>
                              <div className="mt-2 space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="font-medium">NIM:</span>
                                  <span className="font-mono">{permohonan.username}</span>
                                </div>
                                <div className="text-gray-500 text-xs mt-1">
                                  User ID: {permohonan.userId}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Waktu Pengajuan
                          </Label>
                          <div className="mt-2 p-3 bg-white border rounded-lg">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatDateTime(permohonan.createdAt)}</span>
                            </div>
                            {permohonan.updatedAt && permohonan.updatedAt !== permohonan.createdAt && (
                              <div className="mt-2 text-sm text-gray-500">
                                Diupdate: {formatDateTime(permohonan.updatedAt)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            File Dokumen
                          </Label>
                          <div className="mt-2 space-y-2">
                            <div className="p-3 bg-white border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <File className="h-4 w-4" />
                                  <span className="text-sm">File Upload</span>
                                </div>
                                {permohonan.file && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDownload(permohonan.file, `original_${fileName}`)}
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                {permohonan.file ? "Tersedia" : "Tidak tersedia"}
                              </div>
                            </div>
                            
                            {permohonan.file_ijazah_verified && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileCheck className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">File Verified</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDownload(permohonan.file_ijazah_verified!, `verified_${fileName}`)}
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                <div className="mt-2 text-xs text-green-600">
                                  Sudah diverifikasi
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <FileDigit className="h-4 w-4" />
                            Detail Ijazah
                          </Label>
                          <div className="mt-2 p-3 bg-white border rounded-lg">
                            <div className="font-mono text-lg mb-2">{permohonan.nomorIjazah}</div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <BookOpen className="h-4 w-4" />
                              <span>Jumlah Lembar: <strong>{permohonan.jumlahLembar}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">Status</Label>
                          <div className="mt-2 p-3 bg-white border rounded-lg">
                            <div className="flex items-center justify-between">
                              <Badge className={`px-3 py-1 ${getStatusColor(permohonan.status)}`}>
                                {getStatusText(permohonan.status, permohonan.statusText)}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Kode: {permohonan.status}
                              </span>
                            </div>
                            {permohonan.tanggalDiambil && (
                              <div className="mt-3 p-2 bg-gray-50 rounded">
                                <Label className="text-xs font-medium text-gray-500">Tanggal Diambil</Label>
                                <div className="text-sm">
                                  {formatDate(permohonan.tanggalDiambil)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">Keperluan</Label>
                          <div className="mt-2 p-3 bg-white border rounded-lg">
                            <p className="text-sm">{permohonan.keperluan}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab 3: Form Aksi */}
                  <TabsContent value="actions" className="m-0">
                    <div className="space-y-6">
                      {/* Bagian Verifikasi */}
                      <div className="border rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <div>
                            <h4 className="font-semibold">Verifikasi Permohonan</h4>
                            <p className="text-sm text-gray-500">
                              Setujui permohonan untuk melanjutkan ke proses berikutnya
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600">
                            <p>Dengan memverifikasi, Anda menyetujui bahwa:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              <li>Dokumen sudah lengkap dan valid</li>
                              <li>Data pemohon sesuai dengan dokumen</li>
                              <li>Semua persyaratan telah terpenuhi</li>
                            </ul>
                          </div>
                          <Button
                            onClick={handleVerifikasi}
                            disabled={isProcessing || permohonan.status !== 1}
                            className="w-full gap-2"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Memproses...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4" />
                                Verifikasi Permohonan
                              </>
                            )}
                          </Button>
                          {permohonan.status !== 1 && (
                            <p className="text-sm text-amber-600 text-center">
                              Hanya permohonan dengan status "Menunggu" yang dapat diverifikasi
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bagian Penolakan */}
                      <div className="border rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <XCircle className="h-6 w-6 text-red-600" />
                          <div>
                            <h4 className="font-semibold">Tolak Permohonan</h4>
                            <p className="text-sm text-gray-500">
                              Tolak permohonan jika terdapat ketidaksesuaian
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="alasan">Alasan Penolakan</Label>
                            <Textarea
                              id="alasan"
                              placeholder="Berikan alasan penolakan yang jelas..."
                              value={alasanTolak}
                              onChange={(e) => setAlasanTolak(e.target.value)}
                              rows={3}
                              disabled={isProcessing}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Alasan Cepat</Label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                "Dokumen tidak lengkap",
                                "Foto tidak jelas",
                                "Data tidak sesuai",
                                "Berkas rusak/tidak terbaca",
                                "Sudah pernah mengajukan"
                              ].map((reason) => (
                                <Button
                                  key={reason}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setAlasanTolak(reason)}
                                  disabled={isProcessing}
                                >
                                  {reason}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <Button
                            variant="destructive"
                            onClick={handleTolak}
                            disabled={isProcessing || !alasanTolak.trim() || permohonan.status !== 1}
                            className="w-full gap-2"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Memproses...
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4" />
                                Tolak Permohonan
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

              <DialogFooter className="gap-2 border-t pt-4">
                <div className="flex justify-between items-center w-full">
                  <div className="text-sm text-gray-500">
                    ID: #{permohonan.id} • User ID: {permohonan.userId}
                  </div>
                  <div className="flex gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isProcessing}>
                        Tutup
                      </Button>
                    </DialogClose>
                    <Button 
                      variant="default" 
                      onClick={() => window.open(`/pengajuan/${permohonan.id}`, '_blank')}
                      disabled={isProcessing}
                    >
                      Halaman Detail
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Tombol lainnya */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Tinjau Lengkap
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(pdfUrl, fileName)} disabled={!pdfUrl}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {permohonan.file && (
                <DropdownMenuItem onClick={() => handleDownload(permohonan.file, `original_${fileName}`)}>
                  <File className="mr-2 h-4 w-4" />
                  Download File Asli
                </DropdownMenuItem>
              )}
              {permohonan.file_ijazah_verified && (
                <DropdownMenuItem onClick={() => handleDownload(permohonan.file_ijazah_verified!, `verified_${fileName}`)}>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Download File Verified
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Salin Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Cetak Surat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];