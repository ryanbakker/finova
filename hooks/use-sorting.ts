import { useState, useCallback } from "react";

export type SortState = "asc" | "desc" | false;

export const useSorting = () => {
  const [sortStates, setSortStates] = useState<Record<string, SortState>>({});

  const toggleSorting = useCallback((columnId: string) => {
    setSortStates((prev) => {
      const currentState = prev[columnId];

      // Three-state cycle: asc -> desc -> false -> asc
      let newState: SortState;
      if (currentState === "asc") {
        newState = "desc";
      } else if (currentState === "desc") {
        newState = false;
      } else {
        newState = "asc";
      }

      // Clear other columns' sorting when setting a new one
      const updatedStates: Record<string, SortState> = {};
      Object.keys(prev).forEach((key) => {
        if (key !== columnId) {
          updatedStates[key] = false;
        }
      });
      updatedStates[columnId] = newState;

      return updatedStates;
    });
  }, []);

  const getSortState = useCallback(
    (columnId: string): SortState => {
      return sortStates[columnId] || false;
    },
    [sortStates]
  );

  const clearAllSorting = useCallback(() => {
    setSortStates({});
  }, []);

  return {
    sortStates,
    toggleSorting,
    getSortState,
    clearAllSorting,
  };
};
