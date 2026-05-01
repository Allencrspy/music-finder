import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { loadFromStorage, saveToStorage } from "./storageUtils";
import type { User } from "firebase/auth";

export interface SyncConfig<T> {
  user: User | null;
  storeKey: string;
  dataKey: string;
  onDataLoaded: (data: T) => void;
  onSetCloudLoaded: (loaded: boolean) => void;
  fallbackData: T;
}

export const syncStoreWithUser = async <T>({
  user,
  storeKey,
  dataKey,
  onDataLoaded,
  onSetCloudLoaded,
  fallbackData,
}: SyncConfig<T>) => {
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data()[dataKey]) {
        onDataLoaded(docSnap.data()[dataKey] as T);
      }
      onSetCloudLoaded(true);
    } catch (error) {
      console.error(`Error syncing ${dataKey}:`, error);
    }
  } else {
    onDataLoaded(loadFromStorage<T>(storeKey) || fallbackData);
    onSetCloudLoaded(false);
  }
};

export const persistStoreData = async <T>(
  user: User | null,
  isCloudLoaded: boolean,
  storeKey: string,
  dataKey: string,
  data: T,
) => {
  if (user && isCloudLoaded) {
    const docRef = doc(db, "users", user.uid);
    try {
      await setDoc(docRef, { [dataKey]: data }, { merge: true });
    } catch (err) {
      console.error(`Error persisting ${dataKey} to cloud:`, err);
    }
  } else if (!user) {
    saveToStorage(storeKey, data);
  }
};
