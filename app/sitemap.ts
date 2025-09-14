import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://finova-management.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://finova-management.vercel.app/welcome",
      lastModified: new Date(),
    },
    {
      url: "https://finova-management.vercel.app/privacy",
      lastModified: new Date(),
    },
    {
      url: "https://finova-management.vercel.app/assets",
      lastModified: new Date(),
    },
    {
      url: "https://finova-management.vercel.app/bills",
      lastModified: new Date(),
    },
    {
      url: "https://finova-management.vercel.app/budgeting",
      lastModified: new Date(),
    },
    {
      url: "https://finova-management.vercel.app/goals",
      lastModified: new Date(),
    },
    {
      url: "https://finova-management.vercel.app/liabilities",
      lastModified: new Date(),
    },
    {
      url: "https://finova-management.vercel.app/transactions",
      lastModified: new Date(),
    },
    {
      url: "https://finova-management.vercel.app/report",
      lastModified: new Date(),
    },
  ];
}
