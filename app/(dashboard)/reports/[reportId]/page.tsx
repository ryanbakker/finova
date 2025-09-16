"use client";

import { ReportViewer } from "@/components/reports";
import { useRouter } from "next/navigation";
import { use } from "react";
import { triggerReportsRefresh } from "@/lib/utils/reports-events";
import { toast } from "sonner";

interface ReportPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const router = useRouter();
  const { reportId } = use(params);

  const handleBack = () => {
    router.push("/reports");
  };

  const handleDelete = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      // Trigger global refresh event to sync sidebar
      triggerReportsRefresh();

      // Show success toast
      toast.success("Report Deleted", {
        description: "The report has been permanently deleted.",
      });

      // Redirect back to reports list after successful deletion
      router.push("/reports");
    } catch (error) {
      console.error("Error deleting report:", error);
      // Show error toast
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete the report. Please try again.";
      toast.error("Delete Failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="space-y-6 page-content">
      <ReportViewer
        reportId={reportId}
        onBack={handleBack}
        onDelete={handleDelete}
      />
    </div>
  );
}
