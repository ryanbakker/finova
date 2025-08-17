import React from "react";
import { Bill } from "@/lib/types";
import { getCategoriesByType } from "@/constants";
import { getBillCategoryIcon } from "@/lib/utils/categoryUtils";

export const sampleBills: Bill[] = [
  {
    id: "1",
    name: "Rent Payment",
    amount: 1800,
    dueDate: "2024-12-01",
    category: "Rent/Mortgage",
    isRecurring: true,
    icon: getBillCategoryIcon("Rent/Mortgage")
      ? React.createElement(getBillCategoryIcon("Rent/Mortgage")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "monthly",
    notes: "Monthly rent payment for apartment",
  },
  {
    id: "2",
    name: "Car Insurance",
    amount: 89.5,
    dueDate: "2024-12-02",
    category: "Insurance",
    isRecurring: true,
    icon: getBillCategoryIcon("Insurance")
      ? React.createElement(getBillCategoryIcon("Insurance")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "monthly",
    notes: "Comprehensive car insurance coverage",
  },
  {
    id: "3",
    name: "Electric Bill",
    amount: 145.2,
    dueDate: "2024-12-05",
    category: "Electricity",
    isRecurring: true,
    icon: getBillCategoryIcon("Electricity")
      ? React.createElement(getBillCategoryIcon("Electricity")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "monthly",
    notes: "Monthly electricity consumption",
  },
  {
    id: "4",
    name: "Internet Service",
    amount: 79.99,
    dueDate: "2024-12-08",
    category: "Internet",
    isRecurring: true,
    icon: getBillCategoryIcon("Internet")
      ? React.createElement(getBillCategoryIcon("Internet")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "monthly",
    notes: "High-speed internet service",
  },
  {
    id: "5",
    name: "Credit Card Payment",
    amount: 450,
    dueDate: "2024-12-12",
    category: "Credit Card",
    isRecurring: true,
    icon: getBillCategoryIcon("Credit Card")
      ? React.createElement(getBillCategoryIcon("Credit Card")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "monthly",
    notes: "Minimum payment due",
  },
  {
    id: "6",
    name: "Phone Bill",
    amount: 65.0,
    dueDate: "2024-12-15",
    category: "Phone",
    isRecurring: true,
    icon: getBillCategoryIcon("Phone")
      ? React.createElement(getBillCategoryIcon("Phone")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "monthly",
    notes: "Mobile phone plan",
  },
  {
    id: "7",
    name: "Gym Membership",
    amount: 45.0,
    dueDate: "2024-12-20",
    category: "Other Bills",
    isRecurring: true,
    icon: getBillCategoryIcon("Other Bills")
      ? React.createElement(getBillCategoryIcon("Other Bills")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "monthly",
    notes: "Monthly gym membership fee",
  },
  {
    id: "8",
    name: "Car Registration",
    amount: 320,
    dueDate: "2024-11-25",
    category: "Other Bills",
    isRecurring: false,
    icon: getBillCategoryIcon("Other Bills")
      ? React.createElement(getBillCategoryIcon("Other Bills")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "overdue",
    frequency: "yearly",
    notes: "Annual vehicle registration renewal",
  },
  {
    id: "9",
    name: "Home Insurance",
    amount: 180,
    dueDate: "2024-12-10",
    category: "Insurance",
    isRecurring: true,
    icon: getBillCategoryIcon("Insurance")
      ? React.createElement(getBillCategoryIcon("Insurance")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "monthly",
    notes: "Home contents and building insurance",
  },
  {
    id: "10",
    name: "Netflix Subscription",
    amount: 15.99,
    dueDate: "2024-12-03",
    category: "Other Bills",
    isRecurring: true,
    icon: getBillCategoryIcon("Other Bills")
      ? React.createElement(getBillCategoryIcon("Other Bills")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "paid",
    frequency: "monthly",
    notes: "Streaming service subscription",
  },
  {
    id: "11",
    name: "Water Bill",
    amount: 85.5,
    dueDate: "2024-12-07",
    category: "Water",
    isRecurring: true,
    icon: getBillCategoryIcon("Water")
      ? React.createElement(getBillCategoryIcon("Water")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "quarterly",
    notes: "Quarterly water consumption",
  },
  {
    id: "12",
    name: "Dental Checkup",
    amount: 120,
    dueDate: "2024-12-18",
    category: "Other Bills",
    isRecurring: false,
    icon: getBillCategoryIcon("Other Bills")
      ? React.createElement(getBillCategoryIcon("Other Bills")!, {
          className: "h-4 w-4",
        })
      : null,
    status: "unpaid",
    frequency: "yearly",
    notes: "Annual dental examination",
  },
];

// Get bill categories from constants
export const billCategories = getCategoriesByType("bills").map(
  (cat) => cat.name
);

export const billStatuses = ["paid", "unpaid", "overdue"];

export const billFrequencies = ["weekly", "monthly", "quarterly", "yearly"];
