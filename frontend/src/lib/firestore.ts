// src/lib/firestore.ts
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function saveMoodLog(userId: string, mood: string) {
  await addDoc(collection(db, "moodLogs"), {
    userId,
    mood,
    timestamp: new Date()
  });
}

export async function fetchMoodLogs(userId: string) {
  const snapshot = await getDocs(collection(db, "moodLogs"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
