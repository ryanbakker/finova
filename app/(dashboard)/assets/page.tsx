"use client";

import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { Asset } from "@/lib/types";
import { Plus, BarChart3, Table as TableIcon } from "lucide-react";

import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Suspense, useState, useEffect, useRef } from "react";
import {
  AssetPageSkeleton,
  AssetInsights,
  AssetFilters,
  CreateAssetDialog,
  EditAssetDialog,
  AssetDetailsAndHistoryDialog,
} from "@/components/assets";
import { useSorting } from "@/hooks/use-sorting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserAssets } from "@/lib/actions/asset.actions";

import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";

function AssetsPageContent() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("table");
  // Filters are now controlled within AssetFilters component to align with other pages
  const [tableReady, setTableReady] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const { sortStates, toggleSorting } = useSorting();
  const _searchParams = useSearchParams();
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableRef = useRef<any>(null);

  // Create columns
  const columns = createColumns(sortStates, toggleSorting);

  // Action handlers
  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDetailsDialog(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowEditDialog(true);
  };

  const handleDeleteAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    // You can implement delete functionality here
  };

  // Set global action handlers
  useEffect(() => {
    import("./columns").then(({ setGlobalActionHandlers }) => {
      setGlobalActionHandlers({
        onView: handleViewAsset,
        onEdit: handleEditAsset,
        onDelete: handleDeleteAsset,
      });
    });
  }, []);

  // Load assets from database
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setIsLoading(true);
        const userAssets = await getUserAssets();
        setAssets(userAssets);
      } catch (_error) {
        toast({
          title: "Error",
          description: "Failed to load assets. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [toast]);

  // Filters expansion is managed within AssetFilters

  // Listen for create asset dialog events from empty state
  useEffect(() => {
    const handleOpenCreateDialog = () => {
      setShowCreateDialog(true);
    };

    window.addEventListener("openCreateAssetDialog", handleOpenCreateDialog);

    return () => {
      window.removeEventListener(
        "openCreateAssetDialog",
        handleOpenCreateDialog
      );
    };
  }, []);

  // Function to refresh assets
  const refreshAssets = async () => {
    try {
      setIsLoading(true);
      const userAssets = await getUserAssets();
      setAssets(userAssets);
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to refresh assets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 page-content">
        <AssetPageSkeleton />
        <DashboardFooter />

        {/* Create Asset Dialog */}
        <CreateAssetDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={refreshAssets}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-content">
      <div className="flex gap-5 md:gap-0 justify-between flex-col md:flex-row md:items-end">
        <div>
          <h1 className="page-title">Assets</h1>
          <h2 className="page-sub-title">
            Track and manage your financial assets, investments, and property
            values.
          </h2>
        </div>
        <Button
          className="button-blue-bg hover:cursor-pointer"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Asset
        </Button>
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
                <span>Asset List</span>
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

          {/* Filter controls moved into AssetFilters to standardize UX */}
        </div>

        {/* Filters Section - now self-managed within AssetFilters */}
        {activeTab === "table" &&
          (tableReady ? (
            <AssetFilters table={tableRef.current || undefined} />
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
              onRefresh={refreshAssets}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <AssetInsights assets={assets} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <DashboardFooter />

      <CreateAssetDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => refreshAssets()}
      />

      {/* Edit Asset Dialog */}
      <EditAssetDialog
        asset={selectedAsset}
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedAsset(null);
        }}
        onSuccess={refreshAssets}
      />

      {/* Asset Details and History Dialog */}
      <AssetDetailsAndHistoryDialog
        asset={selectedAsset}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedAsset(null);
        }}
      />
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
