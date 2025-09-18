"use client";

import { DashboardFooter } from "@/components/DashboardFooter";
import { Liability } from "@/lib/types";
import { BarChart3, Table as TableIcon, CreditCard } from "lucide-react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useReactTable } from "@tanstack/react-table";
import {
  LiabilityPageSkeleton,
  LiabilityInsights,
  LiabilityFilters,
  CreateLiabilityDialog,
  LiabilityDetailsAndHistoryDialog,
  UpdateLiabilityAmountDialog,
} from "@/components/liabilities";
import { useSorting } from "@/hooks/use-sorting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLiabilitiesByUserId } from "@/lib/actions/liability.actions";
import { useToast } from "@/components/ui/use-toast";
import { DynamicUpgradeOverlay } from "@/components/upgrade";

function LiabilitiesPage() {
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("table");
  const [tableReady, setTableReady] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showUpdateAmountDialog, setShowUpdateAmountDialog] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Liabilities | Finova";
  }, []);
  const [selectedLiability, setSelectedLiability] = useState<Liability | null>(
    null
  );
  const { sortStates, toggleSorting } = useSorting();
  const tableRef = useRef<ReturnType<typeof useReactTable<Liability>> | null>(
    null
  );
  const { toast } = useToast();

  // Create columns
  const columns = createColumns(sortStates, toggleSorting);

  // Action handlers
  const handleViewLiability = (liability: Liability) => {
    setSelectedLiability(liability);
    setShowDetailsDialog(true);
  };

  const handleEditLiability = (liability: Liability) => {
    setSelectedLiability(liability);
    // You can implement edit functionality here
  };

  const handleDeleteLiability = (liability: Liability) => {
    setSelectedLiability(liability);
    // You can implement delete functionality here
  };

  // Set global action handlers
  useEffect(() => {
    import("./columns").then(({ setGlobalActionHandlers }) => {
      setGlobalActionHandlers({
        onView: handleViewLiability,
        onEdit: handleEditLiability,
        onDelete: handleDeleteLiability,
      });
    });
  }, []);

  // Load liabilities from database
  const loadLiabilities = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getLiabilitiesByUserId();
      // Set the liabilities array regardless of whether it's empty or has data
      setLiabilities(data || []);
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to load liabilities. Please try again.",
        variant: "destructive",
      });
      // Set empty array on error to clear any previous data
      setLiabilities([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadLiabilities();
  }, [loadLiabilities]);

  // Filters are now controlled within LiabilityFilters component to align with other pages

  if (isLoading) {
    return (
      <div className="space-y-6 page-content">
        <LiabilityPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  return (
    <DynamicUpgradeOverlay
      title="Liability Tracking"
      description="Monitor your debts, loans, and financial obligations with comprehensive tracking and payment insights."
      icon={CreditCard}
    >
      <div className="space-y-6 page-content">
        <div className="flex gap-5 md:gap-0 justify-between flex-col md:flex-row md:items-end">
          <div>
            <h1 className="page-title">Liabilities</h1>
            <h2 className="page-sub-title">
              Track and manage your financial liabilities, loans, and debt
              obligations.
            </h2>
          </div>
          <CreateLiabilityDialog onLiabilityCreated={loadLiabilities} />
        </div>

        {/* View Toggle Tabs - Always visible */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-auto"
            >
              <TabsList className="grid w-auto grid-cols-2">
                <TabsTrigger
                  value="table"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <TableIcon className="h-4 w-4" />
                  <span>Liability List</span>
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Insights</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filter controls moved into LiabilityFilters to standardize UX */}
          </div>

          {/* Filters Section - now self-managed within LiabilityFilters */}
          {activeTab === "table" &&
            (tableReady ? (
              <LiabilityFilters table={tableRef.current || undefined} />
            ) : (
              <div className="w-full p-4 text-center text-muted-foreground bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg animate-in fade-in duration-300">
                <div className="animate-pulse">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ))}
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="table" className="space-y-2">
            <Suspense fallback={<LiabilityPageSkeleton />}>
              <DataTable
                columns={columns}
                data={liabilities}
                isLoading={isLoading}
                sortStates={sortStates}
                onTableReady={(table) => {
                  tableRef.current = table;
                  setTableReady(true);
                }}
                onDataChange={loadLiabilities}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <LiabilityInsights
              liabilities={liabilities}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

        <DashboardFooter />

        {/* Dialogs */}
        <LiabilityDetailsAndHistoryDialog
          liability={selectedLiability}
          isOpen={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
        />

        <UpdateLiabilityAmountDialog
          liability={selectedLiability}
          isOpen={showUpdateAmountDialog}
          onClose={() => setShowUpdateAmountDialog(false)}
          onSuccess={loadLiabilities}
        />
      </div>
    </DynamicUpgradeOverlay>
  );
}

export default LiabilitiesPage;
