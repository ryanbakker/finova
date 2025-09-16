/**
 * Utility functions for managing global report state synchronization
 */

export const REPORT_EVENTS = {
  REFRESH: "reports:refresh",
  DELETE: "reports:delete",
  CREATE: "reports:create",
} as const;

/**
 * Trigger a global event to refresh reports in all components
 */
export function triggerReportsRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(REPORT_EVENTS.REFRESH));
  }
}

/**
 * Trigger a global event when a report is deleted
 */
export function triggerReportDeleted(reportId: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(REPORT_EVENTS.DELETE, { detail: { reportId } })
    );
  }
}

/**
 * Trigger a global event when a report is created
 */
export function triggerReportCreated(reportId: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(REPORT_EVENTS.CREATE, { detail: { reportId } })
    );
  }
}

/**
 * Listen for report refresh events
 */
export function onReportsRefresh(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();
  window.addEventListener(REPORT_EVENTS.REFRESH, handler);

  return () => window.removeEventListener(REPORT_EVENTS.REFRESH, handler);
}

/**
 * Listen for report deletion events
 */
export function onReportDeleted(callback: (reportId: string) => void) {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail.reportId);
  };
  window.addEventListener(REPORT_EVENTS.DELETE, handler);

  return () => window.removeEventListener(REPORT_EVENTS.DELETE, handler);
}

/**
 * Listen for report creation events
 */
export function onReportCreated(callback: (reportId: string) => void) {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail.reportId);
  };
  window.addEventListener(REPORT_EVENTS.CREATE, handler);

  return () => window.removeEventListener(REPORT_EVENTS.CREATE, handler);
}
