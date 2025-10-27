import React, { useEffect, useState } from "react"; // useState ko import kiya
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Card abhi bhi use hoga
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon, // Isko rehne de sakte hain ya hata sakte hain
  CreditCard,
  Crown,
  LogOut,
  FileText, // FileText import kiya (Header ke liye)
} from "lucide-react";
import { useLocation } from "wouter";
import fileIcon from "../attached_assets/file.png"; // fileIcon import check (Header ke liye)

// Sidebar ko import kiya
import Sidebar from "../components/Sidebar";

// NAYA IMPORT: ShadCN Calendar component ko import kiya
import { Calendar } from "@/components/ui/calendar";

export default function CalendarPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // NAYI LINE: Calendar ki date ko store karne ke liye state banaya
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // Auth check
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You have been logged out. Please sign in.",
        variant: "destructive",
      });
      setLocation("/signin");
    }
  }, [user, isLoading, toast, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Render null while redirecting
  if (!user) {
    return null;
  }

  const isSubscribed =
    user.subscriptionStatus === "active" &&
    (user.subscriptionTier === "monthly" ||
      user.subscriptionTier === "yearly");

  return (
    <div className="flex min-h-screen bg-background">
      {/* 1. Sidebar */}
      <Sidebar isSubscribed={isSubscribed} setLocation={setLocation} />

      {/* 2. Main Content Area (Scrollable) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Header (Same as Dashboard) */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Header icon/logo ko fileIcon se update kiya (agar `fileIcon` available hai) */}
                <img
                  src={fileIcon} 
                  alt="File Icon" 
                  className="w-8 h-8 object-contain" 
                />
                <span className="text-2xl font-bold font-[Poppins]">
                  Lomerse
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = "/auth/logout";
                  }}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN CALENDAR CONTENT --- */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your Calendar
            </h1>
            <p className="text-muted-foreground">
              Manage your schedule and events
            </p>
          </div>

          {/* --- START: Calendar Component (Placeholder ki jagah) --- */}
          <Card className="max-w-max mx-auto">
            {/* Card ke andar calendar daala taaki border accha lage */}
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md" // yahaan border ki zaroorat nahi agar Card mein hai
            />
          </Card>
          
          {/* Aap selected date ko yahaan dikha bhi sakte hain */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Selected Date: {date ? date.toLocaleDateString() : "None"}
            </p>
          </div>
          {/* --- END: Calendar Component --- */}
          
        </main>
      </div>
    </div>
  );
}