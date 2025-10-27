import React from 'react';
import { useLocation } from 'wouter';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // shadcn component

export const AppBreadcrumb = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const templateName = searchParams.get('template');
  const themeName = searchParams.get('theme');

  // Pata lagao ki hum kis page par hain
  let currentStep = 'template';
  if (location.startsWith('/choose-theme')) {
    currentStep = 'theme';
  } else if (location.startsWith('/create-invoice')) {
    currentStep = 'editor';
  }

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {/* Step 1: Template */}
        <BreadcrumbItem>
          {currentStep === 'template' ? (
            <BreadcrumbPage>Step 1: Choose Template</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href="/choose-template">Template</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Step 2: Theme */}
        {(currentStep === 'theme' || currentStep === 'editor') && (
          <BreadcrumbItem>
            {currentStep === 'theme' ? (
              <BreadcrumbPage>Step 2: Choose Theme</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={`/choose-theme?template=${templateName}`}>Theme</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        )}

        {/* Step 3: Editor */}
        {currentStep === 'editor' && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Step 3: Edit Invoice</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;