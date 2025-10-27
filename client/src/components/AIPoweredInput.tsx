import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAppSettings } from '@/contexts/SettingsContext';

interface AIPoweredInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

async function getAISuggestions(text: string, toast: (options: any) => void): Promise<string[]> {
  const apiKey = "AIzaSyBsIfVf1gpqVb-JiE1JaFKZ38H9v05VuOI";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const prompt = `You are an assistant for an invoicing app. Based on the user's input, suggest 3 concise, professional service descriptions. Each suggestion should be under 5 words. The user has typed: "${text}". Provide only the suggestions.`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "STRING"
        }
      }
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      toast({ title: "AI Error", description: "Could not fetch suggestions.", variant: "destructive" });
      return [];
    }

    const result = await response.json();
    const suggestionsText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!suggestionsText) return [];
    
    const suggestions = JSON.parse(suggestionsText);
    return suggestions;

  } catch (error) {
    toast({ title: "Network Error", description: "Please check your connection.", variant: "destructive" });
    return [];
  }
}


export const AIPoweredInput: React.FC<AIPoweredInputProps> = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const suggestionSelectedRef = useRef(false);
  const { aiSuggestionsEnabled } = useAppSettings();

  useEffect(() => {
    if (!aiSuggestionsEnabled) {
      setSuggestions([]);
      return;
    }

    if (suggestionSelectedRef.current) {
      suggestionSelectedRef.current = false;
      return;
    }

    if (value.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const handler = setTimeout(() => {
      setIsLoading(true);
      getAISuggestions(value, toast).then(result => {
        setSuggestions(result);
        setIsLoading(false);
      });
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [value, toast, aiSuggestionsEnabled]);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // --- YEH HAI FIX ---
    // Event object ko nullify hone se pehle currentTarget ko save karein
    const currentTarget = e.currentTarget;
    
    setTimeout(() => {
        // Ab saved 'currentTarget' ko use karein
        if (!currentTarget.contains(document.activeElement)) {
            setSuggestions([]);
        }
    }, 150);
    // --------------------
  };

  return (
    <div className="relative" onBlur={handleBlur}>
      <Input
        value={value}
        onChange={(e) => {
            onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="pr-10"
      />
      {aiSuggestionsEnabled && (
        <div className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 flex items-center justify-center pointer-events-none">
          <Sparkles className={`h-4 w-4 text-yellow-500 transition-all ${isLoading ? 'animate-spin' : ''}`} />
        </div>
      )}
      
      {suggestions.length > 0 && !isLoading && aiSuggestionsEnabled && (
        <div className="absolute top-full mt-2 w-full bg-card border rounded-md shadow-lg z-10 p-2 space-y-1">
          <p className="text-xs text-muted-foreground px-2 pb-1">AI Suggestions:</p>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full text-left p-2 rounded-md text-sm hover:bg-muted"
              onClick={() => {
                suggestionSelectedRef.current = true;
                onChange(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </button>
          ))}
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={() => setSuggestions([])}>Close</Button>
        </div>
      )}
    </div>
  );
};

