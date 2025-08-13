import {
  BarChart3,
  Shield,
  CreditCard,
  TrendingUp,
  Lock,
  Zap,
  Smartphone,
  Globe,
  Check,
  Star,
} from "lucide-react";

export const features = [
  {
    icon: BarChart3,
    title: "Transaction Dashboard",
    description:
      "Get a comprehensive view of all your financial transactions with real-time updates and detailed analytics.",
  },
  {
    icon: TrendingUp,
    title: "Budgeting Tool",
    description:
      "Set budgets, track spending, and achieve your financial goals with our intuitive budgeting system.",
  },
  {
    icon: CreditCard,
    title: "Secure Bank Connection",
    description:
      "Connect your bank accounts securely using industry-standard encryption and bank-level security.",
  },
  {
    icon: Zap,
    title: "Automatic Categorization",
    description:
      "AI-powered categorization automatically organizes your transactions for better financial insights.",
  },
  {
    icon: Shield,
    title: "User Security",
    description:
      "Your data stays private. We never sell or share your financial information with third parties.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description:
      "Access your finances anywhere with our fully responsive design that works on all devices.",
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
    name: "Free Beta",
    price: "$0",
    period: "/month",
    description:
      "Limited time offer while we're in beta. Get full access to all features!",
    features: [
      "Full Feature Access",
      "Unlimited Transactions",
      "Advanced Analytics",
      "Priority Support",
    ],
    buttonText: "Get Started Free",
    buttonAction: "signup",
    isPopular: true,
    isActive: true,
    gradient: "from-sky-500 to-blue-600",
    borderColor: "border-sky-400",
  },
  {
    name: "Premium",
    price: "$9",
    period: "/month",
    description:
      "Coming soon after beta. Advanced features and priority support.",
    features: [
      "Advanced Features",
      "Priority Support",
      "Custom Reports",
      "API Access",
    ],
    buttonText: "Coming Soon",
    buttonAction: "disabled",
    isPopular: false,
    isActive: false,
    gradient: "from-gray-100 to-gray-200",
    borderColor: "border-gray-200",
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "/month",
    description:
      "Coming soon after beta. Team collaboration and advanced analytics.",
    features: [
      "Team Collaboration",
      "Advanced Analytics",
      "Custom Integrations",
      "Dedicated Support",
    ],
    buttonText: "Coming Soon",
    buttonAction: "disabled",
    isPopular: false,
    isActive: false,
    gradient: "from-gray-100 to-gray-200",
    borderColor: "border-gray-200",
  },
];

export const betaFeatures = [
  {
    icon: Check,
    title: "Full Feature Access",
    description: "All premium features available during beta",
  },
  {
    icon: Check,
    title: "Unlimited Transactions",
    description: "Track as many transactions as you need",
  },
  {
    icon: Check,
    title: "Advanced Analytics",
    description: "Comprehensive financial insights & reports",
  },
  {
    icon: Check,
    title: "Priority Support",
    description: "Direct access to our development team",
  },
];

export const pricingSection = {
  title: "Simple, Transparent Pricing",
  subtitle: "Start your financial journey today with our powerful platform",
  betaBadge: "Currently in Beta - 100% Free!",
  betaFeaturesTitle: "What's Included in Beta",
  betaNotice:
    "Beta pricing is subject to change. Early adopters will receive special pricing when we launch our paid plans.",
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
    href: "/budgeting",
    label: "Budgeting",
    icon: "budgets",
    title: "Budgeting",
  },
  {
    href: "/goals",
    label: "Goals",
    icon: "goals",
    title: "Goals",
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
