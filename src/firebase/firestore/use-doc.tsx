
'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentReference, 
  onSnapshot, 
  DocumentSnapshot, 
  DocumentData 
} from 'firebase/firestore';

/**
 * A hook that listens to a single document in Firestore.
 * @param docRef The DocumentReference to listen to.
 * @returns An object containing the document data, loading state, and any error.
 */
export function useDoc<T = DocumentData>(docRef: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<T>) => {
        if (snapshot.exists()) {
          setData({
            ...snapshot.data() as T,
            id: snapshot.id,
          });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching document:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, loading, error };
}
