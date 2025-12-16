// app/(app)/Header.tsx
"use client";

import { FC } from "react";
import Breadcrumbs from "@/components/app-breadcrumb";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  customBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
}

const Header: FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  customBreadcrumbs = false,
  breadcrumbItems = [],
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="py-4 px-6">
        {/* Breadcrumb */}
        <div className="mb-2">
          {customBreadcrumbs && breadcrumbItems.length > 0 ? (
            // Custom breadcrumbs dari pageData
            <CustomBreadcrumb items={breadcrumbItems} />
          ) : (
            // Auto breadcrumbs dari pathname
            <Breadcrumbs />
          )}
        </div>

        {/* Title & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
              {title}
            </h2>

            {subtitle && (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>

          {actions && (
            <div className="flex items-center space-x-3">{actions}</div>
          )}
        </div>
      </div>
    </header>
  );
};

// Komponen untuk custom breadcrumbs
const CustomBreadcrumb: FC<{ items: Array<{ label: string; href?: string }> }> = ({ items }) => {
  const {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } = require("@/components/ui/breadcrumb");
  const Link = require("next/link").default;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <div key={index} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Header;