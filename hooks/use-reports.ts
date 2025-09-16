"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getReportsByUserId,
  ReportResponse,
} from "@/lib/actions/report.actions";

export function useReports(limit: number = 5) {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getReportsByUserId(limit, 0);
      setReports(result.reports);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refetch: fetchReports };
}
