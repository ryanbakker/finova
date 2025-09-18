"use server";

import { connectToDB } from "@/database/db";
import Company from "@/database/models/company.model";

export interface CreateCompanyParams {
  companyId: string;
  name: string;
  subscription?: {
    plan: "free" | "premium" | "pro";
    status: "active" | "inactive" | "cancelled" | "past_due";
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  };
}

export interface UpdateCompanySubscriptionParams {
  plan: "free" | "premium" | "pro";
  status: "active" | "inactive" | "cancelled" | "past_due";
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

export async function createCompany(company: CreateCompanyParams) {
  try {
    await connectToDB();

    const newCompany = await Company.create({
      ...company,
      subscription: company.subscription || {
        plan: "free",
        status: "active",
        cancelAtPeriodEnd: false,
      },
    });

    return JSON.parse(JSON.stringify(newCompany));
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
}

export async function getCompanyById(companyId: string) {
  try {
    await connectToDB();

    const company = await Company.findOne({ companyId });

    return JSON.parse(JSON.stringify(company));
  } catch (error) {
    console.error("Error getting company by ID:", error);
    throw error;
  }
}

export async function updateCompanySubscription(
  companyId: string,
  subscription: UpdateCompanySubscriptionParams
) {
  try {
    await connectToDB();

    const updatedCompany = await Company.findOneAndUpdate(
      { companyId },
      {
        subscription,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return JSON.parse(JSON.stringify(updatedCompany));
  } catch (error) {
    console.error("Error updating company subscription:", error);
    throw error;
  }
}

export async function deleteCompany(companyId: string) {
  try {
    await connectToDB();

    const deletedCompany = await Company.findOneAndDelete({ companyId });

    return JSON.parse(JSON.stringify(deletedCompany));
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
}
