// src/app/mood-tracking/page.tsx
"use client";

import AppShell from "@/components/layout/AppShell";
import MoodSelector from "@/components/mood/MoodSelector";
import JournalInput from "@/components/mood/JournalInput";
import MoodCalendarView from "@/components/mood/MoodCalendarView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { realtimeDb } from "@/lib/firebase";
import { ref, push, get, query, orderByChild, equalTo } from "firebase/database";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import type { MoodEntry } from "@/components/mood/MoodCalendarView";

export default function MoodTrackingPage() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState<string>("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const userId = "mockUserId"; // Replace with actual user ID from authentication

  useEffect(() => {
    const fetchMoodHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const moodEntriesRef = query(ref(realtimeDb, "moodEntries"), orderByChild("userId"), equalTo(userId));
        const snapshot = await get(moodEntriesRef);

        if (snapshot.exists()) {
          const moodEntries = snapshot.val();
          const history = Object.keys(moodEntries)
            .map((key) => ({ id: key, ...moodEntries[key] }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setMoodHistory(history);
        } else {
          console.log("No mood history found.");
        }
      } catch (error) {
        console.error("Error fetching mood history:", error);
        toast({ title: "Error", description: "Could not load mood history.", variant: "destructive" });
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchMoodHistory();
  }, [userId, toast]);

  const handleSaveMood = async () => {
    if (!userId) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    if (!selectedMood) {
      toast({ title: "Hold on!", description: "Please select a mood first.", variant: "default" });
      return;
    }

    setIsSaving(true);
    const newEntryData = {
      userId,
      mood: selectedMood,
      journal: journalText,
      date: new Date().toISOString(),
    };

    try {
      const moodEntriesRef = ref(realtimeDb, "moodEntries");
      const newEntryRef = await push(moodEntriesRef, newEntryData);

      const addedEntry: MoodEntry = {
        id: newEntryRef.key!,
        ...newEntryData,
      };
      setMoodHistory((prev) => [addedEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      toast({ title: "Mood Saved", description: "Your mood entry has been recorded." });
      setSelectedMood(null);
      setJournalText("");
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({ title: "Error", description: "Could not save mood entry.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">How are you feeling today?</CardTitle>
            <CardDescription>Select your current mood and optionally add a journal entry.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
            <JournalInput journalText={journalText} onJournalChange={setJournalText} />
            <Button onClick={handleSaveMood} disabled={isSaving || !selectedMood} className="w-full sm:w-auto">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Mood Entry
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Mood Journey</CardTitle>
            <CardDescription>Review your mood patterns and reflections over time.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <MoodCalendarView moodHistory={moodHistory} />
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
