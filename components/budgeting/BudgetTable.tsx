"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2 } from "lucide-react";
import { Budget } from "@/lib/types";
import { getBudgetCategoryIcon } from "@/lib/utils/categoryUtils";

interface BudgetTableProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
}

export function BudgetTable({ budgets, onEdit, onDelete }: BudgetTableProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage > 100) return "#ef4444"; // red - over budget
    if (percentage > 80) return "#f59e0b"; // amber - warning
    return "#10b981"; // green - good
  };

  const getStatusBadge = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    
    if (percentage > 100) {
      return <Badge variant="destructive">Over Budget</Badge>;
    } else if (percentage > 80) {
      return <Badge variant="secondary">Warning</Badge>;
    } else {
      return <Badge variant="default">On Track</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.amount) * 100;
            const remaining = budget.amount - budget.spent;
            const IconComponent = getBudgetCategoryIcon(budget.category);

            return (
              <TableRow key={budget.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {IconComponent && (
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{budget.category}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(budget.amount, budget.currency)}
                </TableCell>
                <TableCell>
                  {formatCurrency(budget.spent, budget.currency)}
                </TableCell>
                <TableCell>
                  <span className={remaining < 0 ? "text-red-600 font-medium" : ""}>
                    {formatCurrency(remaining, budget.currency)}
                  </span>
                </TableCell>
                <TableCell className="w-32">
                  <div className="space-y-1">
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-2"
                      style={
                        {
                          "--progress-foreground": getProgressColor(percentage),
                        } as React.CSSProperties
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(budget)}</TableCell>
                <TableCell className="capitalize">{budget.period}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(budget)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(budget.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
