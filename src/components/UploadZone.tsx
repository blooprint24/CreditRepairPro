"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
    onUploadComplete?: (uploadId: string) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<Array<{ id: string; file: File; progress: number; status: 'uploading' | 'completed' | 'error' }>>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startUpload = async (file: File) => {
        const tempId = Math.random().toString(36).slice(2);
        setFiles(prev => [...prev, { id: tempId, file, progress: 0, status: 'uploading' }]);

        try {
            // 1. Get presigned URL
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                    size: file.size,
                }),
            });

            if (!res.ok) throw new Error("Failed to get upload URL");

            const { url, fields, uploadId } = await res.json();

            // 2. Upload to S3
            const formData = new FormData();
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            formData.append("file", file);

            const uploadRes = await fetch(url, {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");

            setFiles(prev => prev.map(f => f.id === tempId ? { ...f, status: 'completed', progress: 100 } : f));
            onUploadComplete?.(uploadId);

        } catch (err) {
            console.error(err);
            setFiles(prev => prev.map(f => f.id === tempId ? { ...f, status: 'error' } : f));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(startUpload);
        }
    };

    return (
        <div className="space-y-4">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) Array.from(e.dataTransfer.files).forEach(startUpload); }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all flex flex-col items-center justify-center gap-4",
                    isDragging ? "bg-blue-500/10 border-blue-500 scale-[1.01]" : "bg-slate-900 border-white/10 hover:border-white/20 hover:bg-slate-900/80"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.html"
                />

                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8" />
                </div>

                <div className="text-center">
                    <p className="font-semibold text-white">Click or drag reports here</p>
                    <p className="text-sm text-slate-500 mt-1">TransUnion, Equifax, or Experian (PDF/HTML)</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-3">
                    {files.map((item) => (
                        <div key={item.id} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <FileText className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white max-w-[200px] truncate">{item.file.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {item.status === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                                {item.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                {item.status === 'error' && <X className="h-5 w-5 text-red-500" />}
                                <button
                                    onClick={() => setFiles(prev => prev.filter(f => f.id !== item.id))}
                                    className="p-1 hover:bg-white/5 rounded-md transition-colors"
                                >
                                    <X className="h-4 w-4 text-slate-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
