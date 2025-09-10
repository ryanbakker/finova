"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Database, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

interface MigrationStatusProps {
  className?: string;
}

export function MigrationStatus({ className }: MigrationStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{
    status: "unknown" | "migrated" | "not-migrated";
    message?: string;
  }>({ status: "unknown" });
  const { toast } = useToast();

  const runMigration = async (action: "migrate" | "rollback") => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (data.success) {
        setMigrationStatus({
          status: action === "migrate" ? "migrated" : "not-migrated",
          message: data.message,
        });
        toast({
          title:
            action === "migrate" ? "Migration Completed" : "Rollback Completed",
          description: data.message,
        });
      } else {
        throw new Error(data.message || `Failed to ${action}`);
      }
    } catch (error) {
      console.error(`Error running ${action}:`, error);
      toast({
        title: `${action === "migrate" ? "Migration" : "Rollback"} Failed`,
        description:
          error instanceof Error ? error.message : `Failed to ${action}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (migrationStatus.status) {
      case "migrated":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "not-migrated":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (migrationStatus.status) {
      case "migrated":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Migrated
          </Badge>
        );
      case "not-migrated":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Not Migrated
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Database Migration Status
        </CardTitle>
        <CardDescription>
          Manage the migration to the new event ledger pattern for assets and
          liabilities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          {getStatusBadge()}
        </div>

        {migrationStatus.message && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {migrationStatus.message}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => runMigration("migrate")}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Database className="mr-2 h-4 w-4" />
            )}
            Run Migration
          </Button>

          <Button
            onClick={() => runMigration("rollback")}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Rollback
          </Button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>
            <strong>Migration:</strong> Converts existing data to the new event
            ledger pattern.
          </p>
          <p>
            <strong>Rollback:</strong> Clears the new collections (use with
            caution).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

