/**
 * Utility functions for date formatting and quarter calculations
 */

/**
 * Get the quarter number (1-4) for a given date
 * @param date - The date to get the quarter for
 * @returns Quarter number (1-4)
 */
export function getQuarter(date: Date): number {
  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
  return Math.ceil(month / 3);
}

/**
 * Get the quarter name for a given date
 * @param date - The date to get the quarter name for
 * @returns Quarter name (Q1, Q2, Q3, Q4)
 */
export function getQuarterName(date: Date): string {
  const quarter = getQuarter(date);
  return `Q${quarter}`;
}

/**
 * Format a date for chart display with quarter and year information
 * @param date - The date to format
 * @param includeQuarter - Whether to include quarter information
 * @returns Formatted date string
 */
export function formatDateForChart(
  date: Date,
  includeQuarter: boolean = true
): string {
  const year = date.getFullYear();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();

  if (includeQuarter) {
    const quarter = getQuarterName(date);
    return `${month} ${day}, ${year} (${quarter})`;
  }

  return `${month} ${day}, ${year}`;
}

/**
 * Format a date for chart display with quarter and year information (compact version)
 * @param date - The date to format
 * @returns Formatted date string in compact format
 */
export function formatDateForChartCompact(date: Date): string {
  const year = date.getFullYear();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const quarter = getQuarterName(date);

  return `${month} ${day} (${quarter} ${year})`;
}

/**
 * Get a detailed date string with quarter and year for tooltips
 * @param date - The date to format
 * @returns Detailed formatted date string
 */
export function formatDateDetailed(date: Date): string {
  const year = date.getFullYear();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const quarter = getQuarterName(date);

  return `${month} ${day}, ${year} - ${quarter}`;
}

/**
 * Get quarter and year information as an object
 * @param date - The date to get quarter/year info for
 * @returns Object with quarter, year, and quarterName
 */
export function getQuarterYearInfo(date: Date): {
  quarter: number;
  year: number;
  quarterName: string;
  fullQuarter: string;
} {
  const quarter = getQuarter(date);
  const year = date.getFullYear();
  const quarterName = getQuarterName(date);
  const fullQuarter = `${quarterName} ${year}`;

  return {
    quarter,
    year,
    quarterName,
    fullQuarter,
  };
}
