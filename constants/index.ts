import {
  Shield,
  LayoutDashboard,
  ChartPie,
  ChartLine,
  FileChartColumn,
  MonitorSmartphone,
  ShieldUser,
  ArrowRightLeft,
} from "lucide-react";

export const features = [
  {
    icon: LayoutDashboard,
    title: "Financial Overview",
    description:
      "Get a comprehensive view of all your financial transactions with real-time updates and detailed analytics.",
    images: {
      light: {
        desktop: "/features/dashboard-desktop-light.png",
        mobile: "/features/dashboard-mobile-light.png",
      },
      dark: {
        desktop: "/features/dashboard-desktop-dark.png",
        mobile: "/features/dashboard-mobile-dark.png",
      },
    },
  },
  {
    icon: ChartPie,
    title: "Budgeting Tool",
    description:
      "Set budgets, track spending, and achieve your financial goals with our intuitive budgeting system.",
    images: {
      light: {
        desktop: "/features/budgets-desktop-light.png",
        mobile: "/features/budgets-mobile-light.png",
      },
      dark: {
        desktop: "/features/budgets-desktop-dark.png",
        mobile: "/features/budgets-mobile-dark.png",
      },
    },
  },
  {
    icon: ChartLine,
    title: "Net Worth Tracking",
    description:
      "Track your net worth over time with real-time updates and detailed analytics.",
    images: {
      light: {
        desktop: "/features/networth-desktop-light.png",
        mobile: "/features/networth-mobile-light.png",
      },
      dark: {
        desktop: "/features/networth-desktop-dark.png",
        mobile: "/features/networth-mobile-dark.png",
      },
    },
  },
  {
    icon: ArrowRightLeft,
    title: "Transaction Management",
    description:
      "Manage your transactions with ease and get detailed insights to help you make better financial decisions.",
    images: {
      light: {
        desktop: "/features/transactions-desktop-light.png",
        mobile: "/features/transactions-mobile-light.png",
      },
      dark: {
        desktop: "/features/transactions-desktop-dark.png",
        mobile: "/features/transactions-mobile-dark.png",
      },
    },
  },
  {
    icon: ShieldUser,
    title: "Data & Privacy",
    description:
      "Your data stays private. We never sell or share your financial information with third parties.",
    images: {
      light: {
        desktop: "/features/assets-desktop-light.png",
        mobile: "/features/assets-mobile-light.png",
      },
      dark: {
        desktop: "/features/assets-desktop-dark.png",
        mobile: "/features/assets-mobile-dark.png",
      },
    },
  },
];

export const navigationLinks = [
  {
    href: "/#welcome-hero",
    label: "Get Started",
  },
  {
    href: "/#welcome-features",
    label: "Features",
  },
  {
    href: "/#welcome-pricing",
    label: "Pricing",
  },
  {
    href: "/#welcome-contact",
    label: "Contact",
  },
];

export const footerLinks = [
  {
    href: "/#welcome-features",
    label: "Features",
  },
  {
    href: "/#welcome-pricing",
    label: "Pricing",
  },
  {
    href: "/#welcome-contact",
    label: "Contact",
  },
  {
    href: "/privacy",
    label: "Privacy Policy",
  },
  {
    href: "/terms",
    label: "Terms of Service",
  },
];

export const pricingPlans = [
  {
    name: "Free",
    price: {
      monthly: "",
      annual: "",
    },
    period: {
      monthly: "",
      annual: "",
    },
    description: "Perfect for getting started with managing your finances.",
    features: [
      "Expense Tracking",
      "Transaction Management",
      "Bill Tracking",
      "Personal Budgeting",
      "Financial Goals",
      "Data Protection",
      "Mobile Responsive",
    ],
    buttonText: "Get Started",
    isPopular: false,
    gradient: "from-gray-100 to-gray-200",
    borderColor: "border-gray-200",
    isTrial: true,
  },
  {
    name: "Premium",
    price: {
      monthly: "$9.99",
      annual: "$99.99",
    },
    period: {
      monthly: "/month",
      annual: "/year",
    },
    description:
      "Finance management for individuals serious about financial planning.",
    features: [
      "Expense Tracking",
      "Transaction Management",
      "Bill Tracking",
      "Personal Budgeting",
      "Financial Goals",
      "Data Protection",
      "Mobile Responsive",
    ],
    buttonText: "Purchase",
    isPopular: true,
    gradient: "from-sky-500 to-blue-600",
    borderColor: "border-sky-400",
    isTrial: false,
  },
  {
    name: "Pro",
    price: {
      monthly: "$29.99",
      annual: "$299.99",
    },
    period: {
      monthly: "/month",
      annual: "/year",
    },
    description:
      "Advanced financial management for power users and small businesses.",
    features: [
      "Preimum Features",
      "Net Worth Tracking",
      "Asset Tracking",
      "Liability Tracking",
      "AI-Generated Reports",
      "Data Protection",
      "Mobile Responsive",
    ],
    buttonText: "Purchase",
    isPopular: false,
    gradient: "from-gray-100 to-gray-200",
    borderColor: "border-gray-200",
    isTrial: false,
  },
];

export const pricingSection = {
  title: "Simple, Transparent Pricing",
  subtitle: "Start your financial journey today with our powerful platform.",
  betaBadge: "Currently in Beta - 100% Free!",
  betaFeaturesTitle: "What's Included in Beta",
  betaNotice:
    "All prices are subject to change. Please check our website for the most current pricing information.",
};

export const menuItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: "dashboard",
    title: "Dashboard",
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: "transactions",
    title: "Transactions",
  },
  {
    href: "/bills",
    label: "Bills",
    icon: "bills",
    title: "Bills",
  },
  {
    href: "/goals",
    label: "Goals",
    icon: "goals",
    title: "Goals",
  },
  {
    href: "/budgeting",
    label: "Budgeting",
    icon: "budgets",
    title: "Budgeting",
  },
  {
    href: "/assets",
    label: "Assets",
    icon: "assets",
    title: "Assets",
  },
  {
    href: "/liabilities",
    label: "Liabilities",
    icon: "liabilities",
    title: "Liabilities",
  },
];

// Financial Categories for the entire application
export const financialCategories = {
  // Income categories
  income: [
    { name: "Salary", icon: "DollarSign" },
    { name: "Freelance", icon: "Briefcase" },
    { name: "Investment Returns", icon: "TrendingUp" },
    { name: "Business Income", icon: "Building2" },
    { name: "Rental Income", icon: "Home" },
    { name: "Interest", icon: "PiggyBank" },
    { name: "Dividends", icon: "Coins" },
    { name: "Capital Gains", icon: "BarChart3" },
    { name: "Gifts", icon: "Gift" },
    { name: "Refunds", icon: "ArrowLeft" },
    { name: "Other Income", icon: "Plus" },
  ],

  // Expense categories
  expenses: [
    { name: "Food & Dining", icon: "Utensils" },
    { name: "Transportation", icon: "Car" },
    { name: "Housing", icon: "Home" },
    { name: "Utilities", icon: "Zap" },
    { name: "Healthcare", icon: "Heart" },
    { name: "Entertainment", icon: "Gamepad2" },
    { name: "Shopping", icon: "ShoppingBag" },
    { name: "Education", icon: "GraduationCap" },
    { name: "Travel", icon: "Plane" },
    { name: "Insurance", icon: "Shield" },
    { name: "Taxes", icon: "FileText" },
    { name: "Subscriptions", icon: "CreditCard" },
    { name: "Personal Care", icon: "Scissors" },
    { name: "Pets", icon: "Heart" },
    { name: "Gifts", icon: "Gift" },
    { name: "Charity", icon: "HeartHandshake" },
    { name: "Other Expenses", icon: "Minus" },
  ],

  // Bill categories
  bills: [
    { name: "Rent/Mortgage", icon: "Home" },
    { name: "Electricity", icon: "Zap" },
    { name: "Water", icon: "Droplets" },
    { name: "Gas", icon: "Zap" },
    { name: "Internet", icon: "Wifi" },
    { name: "Phone", icon: "Smartphone" },
    { name: "Cable TV", icon: "Tv" },
    { name: "Insurance", icon: "Shield" },
    { name: "Credit Card", icon: "CreditCard" },
    { name: "Loan Payment", icon: "Banknote" },
    { name: "Property Tax", icon: "Building2" },
    { name: "HOA Fees", icon: "Building2" },
    { name: "Garbage", icon: "Trash2" },
    { name: "Other Bills", icon: "FileText" },
  ],

  // Asset categories
  assets: [
    { name: "Cash", icon: "DollarSign" },
    { name: "Checking Account", icon: "CreditCard" },
    { name: "Savings Account", icon: "PiggyBank" },
    { name: "Investment Account", icon: "TrendingUp" },
    { name: "Retirement Account", icon: "Target" },
    { name: "Real Estate", icon: "Home" },
    { name: "Vehicle", icon: "Car" },
    { name: "Jewelry", icon: "Gem" },
    { name: "Collectibles", icon: "Star" },
    { name: "Business", icon: "Building2" },
    { name: "Cryptocurrency", icon: "Coins" },
    { name: "Precious Metals", icon: "Gem" },
    { name: "Art", icon: "Palette" },
    { name: "Other Assets", icon: "Plus" },
  ],

  // Liability categories
  liabilities: [
    { name: "Credit Card Debt", icon: "CreditCard" },
    { name: "Student Loan", icon: "GraduationCap" },
    { name: "Car Loan", icon: "Car" },
    { name: "Mortgage", icon: "Home" },
    { name: "Personal Loan", icon: "Banknote" },
    { name: "Business Loan", icon: "Building2" },
    { name: "Medical Debt", icon: "Heart" },
    { name: "Tax Debt", icon: "FileText" },
    { name: "Other Debt", icon: "Minus" },
  ],

  // Goal categories
  goals: [
    { name: "Emergency Fund", icon: "Shield" },
    { name: "Retirement", icon: "Target" },
    { name: "Home Purchase", icon: "Home" },
    { name: "Vehicle Purchase", icon: "Car" },
    { name: "Education", icon: "GraduationCap" },
    { name: "Travel", icon: "Plane" },
    { name: "Wedding", icon: "Heart" },
    { name: "Business Startup", icon: "Building2" },
    { name: "Investment Portfolio", icon: "TrendingUp" },
    { name: "Debt Payoff", icon: "CreditCard" },
    { name: "Other Goals", icon: "Flag" },
  ],

  // Budget categories
  budgets: [
    { name: "Housing", icon: "Home" },
    { name: "Transportation", icon: "Car" },
    { name: "Food", icon: "Utensils" },
    { name: "Utilities", icon: "Zap" },
    { name: "Healthcare", icon: "Heart" },
    { name: "Entertainment", icon: "Gamepad2" },
    { name: "Shopping", icon: "ShoppingBag" },
    { name: "Education", icon: "GraduationCap" },
    { name: "Insurance", icon: "Shield" },
    { name: "Savings", icon: "PiggyBank" },
    { name: "Debt Payment", icon: "CreditCard" },
    { name: "Other", icon: "Plus" },
  ],
};

// Helper function to get categories by type
export const getCategoriesByType = (type: keyof typeof financialCategories) => {
  return financialCategories[type] || [];
};

// Helper function to get all category names by type
export const getCategoryNamesByType = (
  type: keyof typeof financialCategories
) => {
  return financialCategories[type]?.map((cat) => cat.name) || [];
};

// Helper function to find category by name and type
export const findCategoryByName = (
  type: keyof typeof financialCategories,
  name: string
) => {
  return financialCategories[type]?.find((cat) => cat.name === name);
};
