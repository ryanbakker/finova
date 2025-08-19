"use client";

import { DashboardFooter } from "@/components/DashboardFooter";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/types";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { Suspense, useState, useEffect } from "react";
import { TransactionPageSkeleton } from "@/components/transactions";
import { useSorting } from "@/hooks/use-sorting";
import { getUserTransactions } from "@/lib/actions/transaction.actions";
import { CreateTransactionDialog } from "@/components/transactions/CreateTransactionDialog";
import { EditTransactionDialog } from "@/components/transactions/EditTransactionDialog";
import { DeleteTransactionDialog } from "@/components/transactions/DeleteTransactionDialog";
import { TransactionDetailsDialog } from "@/components/transactions/TransactionDetailsDialog";
import { toast } from "@/components/ui/use-toast";
import { sampleAccounts, sampleCategories } from "@/lib/data/sample-data";

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const { sortStates, toggleSorting } = useSorting();

  // Create columns
  const columns = createColumns(sortStates, toggleSorting);

  // Load transactions from database
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await getUserTransactions();
        // Always set transactions, even if it's an empty array
        setTransactions(data || []);
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
        // Set empty array on error to prevent infinite loading
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Action handlers
  const handleCreateSuccess = () => {
    // Reload transactions after creation
    const loadTransactions = async () => {
      try {
        const data = await getUserTransactions();
        setTransactions(data || []);
      } catch (error) {
        console.error("Error reloading transactions:", error);
        setTransactions([]);
      }
    };
    loadTransactions();
  };

  const handleEditSuccess = () => {
    // Reload transactions after edit
    const loadTransactions = async () => {
      try {
        const data = await getUserTransactions();
        setTransactions(data || []);
      } catch (error) {
        console.error("Error reloading transactions:", error);
        setTransactions([]);
      }
    };
    loadTransactions();
  };

  const handleDeleteSuccess = () => {
    // Reload transactions after deletion
    const loadTransactions = async () => {
      try {
        const data = await getUserTransactions();
        setTransactions(data || []);
      } catch (error) {
        console.error("Error reloading transactions:", error);
        setTransactions([]);
      }
    };
    loadTransactions();
  };

  // Set up action handlers for the data table
  useEffect(() => {
    const setupActionHandlers = async () => {
      const { setGlobalActionHandlers } = await import("./columns");
      setGlobalActionHandlers({
        onView: (transaction: Transaction) => {
          setSelectedTransaction(transaction);
          setIsDetailsDialogOpen(true);
        },
        onEdit: (transaction: Transaction) => {
          setSelectedTransaction(transaction);
          setIsEditDialogOpen(true);
        },
        onDelete: (transaction: Transaction) => {
          setSelectedTransaction(transaction);
          setIsDeleteDialogOpen(true);
        },
      });
    };
    setupActionHandlers();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TransactionPageSkeleton />
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View, categorize, and analyze your financial transactions to
            understand your spending patterns.
          </p>
        </div>
        <Button
          className="button-blue-bg hover:cursor-pointer"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Suspense fallback={<TransactionPageSkeleton />}>
        {transactions.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Get started by creating your first transaction to track your
                    income and expenses.
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="button-blue-bg hover:cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Transaction
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={transactions}
            isLoading={isLoading}
            sortStates={sortStates}
          />
        )}
      </Suspense>

      <DashboardFooter />

      {/* Dialogs */}
      <CreateTransactionDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        accounts={sampleAccounts}
        categories={sampleCategories}
      />

      <EditTransactionDialog
        transaction={selectedTransaction}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={handleEditSuccess}
        accounts={sampleAccounts}
        categories={sampleCategories}
      />

      <DeleteTransactionDialog
        transaction={selectedTransaction}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSuccess={handleDeleteSuccess}
      />

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
    </div>
  );
}

export default TransactionsPage;
