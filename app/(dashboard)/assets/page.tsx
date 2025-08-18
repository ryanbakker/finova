"use client";

import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { sampleAssets } from "@/components/assets";
import { Asset } from "@/lib/types";
import {
  Plus,
  BarChart3,
  Filter,
  ChevronDown,
  Table as TableIcon,
} from "lucide-react";

import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Suspense, useState, useEffect, useRef } from "react";
import {
  AssetPageSkeleton,
  AssetInsights,
  AssetFilters,
} from "@/components/assets";
import { useSorting } from "@/hooks/use-sorting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useSearchParams } from "next/navigation";

function AssetsPageContent() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("table");
  const [showFilters, setShowFilters] = useState(false);
  const [tableReady, setTableReady] = useState(false);
  const { sortStates, toggleSorting } = useSorting();
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableRef = useRef<any>(null);

  // Create columns
  const columns = createColumns(sortStates, toggleSorting);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setAssets(sampleAssets);
      setIsLoading(false);
    }, 1500); // Simulate 1.5s loading time

    return () => clearTimeout(timer);
  }, []);

  // Check if there are active filters to determine initial filter visibility
  useEffect(() => {
    const hasActiveFilters = [
      searchParams.get("name"),
      searchParams.get("category"),
      searchParams.get("status"),
      searchParams.get("minValue"),
      searchParams.get("maxValue"),
    ].some(Boolean);

    if (hasActiveFilters) {
      setShowFilters(true);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AssetPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">
            Track and manage your financial assets, investments, and property
            values.
          </p>
        </div>
        <Button className="button-blue-bg hover:cursor-pointer">
          <Plus className="mr-1 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      {/* View Toggle Tabs - Always visible */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-auto"
          >
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger
                value="table"
                className="flex items-center space-x-2"
              >
                <TableIcon className="h-4 w-4" />
                <span>Asset List</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Toggle Button - Only show when table tab is active */}
          {activeTab === "table" && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(() => {
                  const activeFiltersCount = [
                    searchParams.get("name"),
                    searchParams.get("category"),
                    searchParams.get("status"),
                    searchParams.get("minValue"),
                    searchParams.get("maxValue"),
                  ].filter(Boolean).length;

                  return activeFiltersCount > 0 ? (
                    <span className="ml-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-200 animate-pulse">
                      {activeFiltersCount}
                    </span>
                  ) : null;
                })()}
                <div
                  className={`transition-transform duration-200 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>

              {(() => {
                const activeFiltersCount = [
                  searchParams.get("name"),
                  searchParams.get("category"),
                  searchParams.get("status"),
                  searchParams.get("minValue"),
                  searchParams.get("maxValue"),
                ].filter(Boolean).length;

                return activeFiltersCount > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Clear all filters by navigating to the base path
                      window.location.href = window.location.pathname;
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Clear All Filters
                  </Button>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Filters Section - Only show when table tab is active */}
        {activeTab === "table" && (
          <div
            className={`transition-all duration-300 ease-in-out ${
              showFilters
                ? "opacity-100 max-h-[1000px]"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            {tableReady ? (
              <div className="w-full p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm">
                <AssetFilters table={tableRef.current || undefined} />
              </div>
            ) : (
              <div className="w-full p-4 text-center text-muted-foreground bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg animate-in fade-in duration-300">
                <div className="animate-pulse">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="table" className="space-y-2">
          <Suspense fallback={<AssetPageSkeleton />}>
            <DataTable
              columns={columns}
              data={assets}
              isLoading={isLoading}
              sortStates={sortStates}
              onTableReady={(table) => {
                tableRef.current = table;
                setTableReady(true);
              }}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <AssetInsights assets={assets} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <DashboardFooter />
    </div>
  );
}

function AssetsPage() {
  return (
    <Suspense fallback={<AssetPageSkeleton />}>
      <AssetsPageContent />
    </Suspense>
  );
}

export default AssetsPage;
