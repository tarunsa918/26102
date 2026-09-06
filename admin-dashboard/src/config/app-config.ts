import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Admin Dashboard",
  version: packageJson.version,
  copyright: `© ${currentYear}, Admin Dashboard.`,
  meta: {
    title: "Admin Dashboard - Modern TanStack Start Dashboard Starter Template",
    description:
      "Admin Dashboard is a modern, open-source dashboard starter template built with TanStack Start, Tailwind CSS v4, and shadcn/ui. Perfect for SaaS apps, admin panels, and internal tools—fully customizable and production-ready.",
  },
};
