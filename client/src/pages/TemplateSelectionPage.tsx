

// import React from 'react';
// import { useLocation } from "wouter";
// import { useAuth } from "@/hooks/useAuth";
// import { Card, CardContent } from "@/components/ui/card";
// import { Crown } from "lucide-react";

// // --- Import the new Layout ---
// import AppLayout from "@/components/AppLayout";
// import AppBreadcrumb from "@/components/AppBreadcrumb";

// // Templates array (page-specific, so it stays)
// const templates = [
//   { name: 'classic', isPro: false, description: 'A timeless, professional layout.' },
//   { name: 'modern', isPro: false, description: 'Clean design with a bold side accent.' },
//   { name: 'minimal', isPro: true, description: 'Elegant and simple, focuses on typography.' },
//   { name: 'bhookhad-baba', isPro: true, description: 'Specialized for tiffin services.' },
// ];

// // TemplatePreview component (page-specific, so it stays)
// const TemplatePreview = ({ name, description, locked }: { name: string, description: string, locked: boolean }) => {
//   const [, setLocation] = useLocation();

//   const handleSelect = () => {
//     if (locked) {
//       setLocation('/subscription');
//     } else {
//       setLocation(`/choose-theme?template=${name}`);
//     }
//   };

//   return (
//     <div className="relative group cursor-pointer" onClick={handleSelect}>
//       <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-primary">
//         <CardContent className="p-0">
//           <div className="aspect-[3/4] w-full bg-gray-10a-100 dark:bg-gray-800 flex items-center justify-center p-4 border-b border-border">
//             {/* Template preview visuals (same as before) */}
//             {name === 'classic' && <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-2 flex flex-col"><div className="w-1/2 h-3 rounded-full bg-primary/20 mb-4"></div><div className="w-full h-2 rounded-full bg-gray-300 dark:bg-gray-700 mb-2"></div><div className="w-3/4 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div></div>}
//             {name === 'modern' && <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-2 flex gap-2"><div className="w-4 h-full bg-primary/20 rounded-full"></div><div className="flex-1"><div className="w-1/2 h-3 rounded-full bg-gray-300 dark:bg-gray-700 mb-4"></div></div></div>}
//             {name === 'minimal' && <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-2 flex flex-col"><div className="w-1/3 h-3 rounded-full bg-gray-300 dark:bg-gray-700 mb-6"></div><div className="w-full h-px bg-gray-300 dark:bg-gray-600 my-2"></div><div className="w-full h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div></div>}
//             {name === 'bhookhad-baba' && <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-2 flex flex-col items-center justify-center"><div className="w-1/2 h-3 rounded-full bg-primary/20 mb-4"></div><p className="text-xs text-muted-foreground">Tiffin Service</p></div>}
//           </div>
//           <div className="p-4">
//             <p className="font-semibold text-sm capitalize text-foreground">{name}</p>
//             <p className="text-xs text-muted-foreground">{description}</p>
//           </div>
//         </CardContent>
//       </Card>
//       {locked && (
//         <div className="absolute inset-0 bg-black/60 rounded-lg flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//           <Crown className="w-8 h-8 text-yellow-400" />
//           <p className="text-white font-semibold mt-2">Upgrade to Pro</p>
//         </div>
//       )}
//     </div>
//   );
// };


// export default function TemplateSelectionPage() {
//   // All the dock, auth, and menu logic is GONE
//   // We only need 'user' to check the subscription status
//   const { user } = useAuth();
  
//   // AppLayout handles the loading/null state, so we can assume 'user' exists
//   const isSubscribed = user!.subscriptionStatus === 'active';

//   return (
//     // Pass the AppBreadcrumb as the pageHeader prop
//     <AppLayout pageHeader={<AppBreadcrumb />}>
      
//       {/* NO <Dock>, NO <main>, NO <div min-h-screen...
//         Just the page content.
//       */}

//       <div className="mb-12">
//         <h2 className="text-2xl font-semibold text-foreground mb-6">Available Designs</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
//             {templates.map(template => (
//               <TemplatePreview 
//                 key={template.name} 
//                 name={template.name} 
//                 description={template.description}
//                 locked={template.isPro && !isSubscribed} 
//               />
//             ))}
//         </div>
//       </div>
//     </AppLayout>
//   );
// }




import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import AppBreadcrumb from "@/components/AppBreadcrumb";

const templates = [
  { name: "classic", isPro: false, description: "A timeless, professional layout." },
  { name: "modern", isPro: false, description: "Clean design with a bold side accent." },
  { name: "minimal", isPro: true, description: "Elegant and simple, focuses on typography." },
  { name: "slate", isPro: true, description: "Dark, sophisticated theme." },
  { name: "ocean", isPro: true, description: "Cool blue tones." },
  { name: "sunset", isPro: true, description: "Warm gradient theme." },
  { name: "mint", isPro: true, description: "Fresh green accents." },
  { name: "lavender", isPro: true, description: "Soft purple hues." },
  { name: "blush", isPro: true, description: "Gentle pink theme." },
  { name: "graphite", isPro: true, description: "Modern grey scale." },
  { name: "seaside", isPro: true, description: "Beachy, relaxed feel." },
  { name: "vibrant", isPro: true, description: "Bright and energetic colors." },
  { name: "pastel", isPro: true, description: "Subtle and soft colors." },
  { name: "rose", isPro: true, description: "Elegant floral tones." },
  { name: "lime", isPro: true, description: "Zesty and bright green." },
];

const TemplatePreview = ({
  name,
  description,
  locked,
}: {
  name: string;
  description: string;
  locked: boolean;
}) => {
  const [, setLocation] = useLocation();

  const handleSelect = () => {
    if (locked) setLocation("/subscription");
    else setLocation(`/choose-theme?template=${name}`);
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleSelect}>
      <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-primary">
        <CardContent className="p-0">
          <div className="aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4 border-b border-border">
            {name === "classic" && <div className="w-1/2 h-3 bg-primary/20 rounded-full" />}
            {name === "modern" && <div className="w-4 h-full bg-primary/20 rounded-full" />}
            {name !== "classic" && name !== "modern" && (
              <div className="w-1/2 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mb-4"></div>
            )}
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm capitalize">{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
      {locked && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Crown className="w-8 h-8 text-yellow-400" />
          <p className="text-white font-semibold mt-2">Upgrade to Pro</p>
        </div>
      )}
    </div>
  );
};

export default function TemplateSelectionPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <AppLayout pageHeader={<AppBreadcrumb />}>
        <div className="text-center p-12">Loading user data...</div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout pageHeader={<AppBreadcrumb />}>
        <div className="text-center p-12 text-red-500">
          Could not load user data. Please try logging in again.
        </div>
      </AppLayout>
    );
  }

  const hasActiveSubscription = user.subscriptionStatus === "active";
  const hasCredits = (user.invoiceCredits || 0) > 0;
  const canUsePremium = hasActiveSubscription || hasCredits;

  return (
    <AppLayout pageHeader={<AppBreadcrumb />}>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Available Designs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
          {templates.map((template) => (
            <TemplatePreview
              key={template.name}
              name={template.name}
              description={template.description}
              locked={template.isPro && !canUsePremium}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
