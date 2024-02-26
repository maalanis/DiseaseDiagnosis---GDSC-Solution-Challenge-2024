import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, query, where } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService {
  constructor(private firestore: Firestore) {}

  getAllSymptomsValues(): Observable<any[]> {
    const collection1Ref = collection(this.firestore, 'symptomsCOVID');
    const collection2Ref = collection(this.firestore, 'symptomsCold');
    const collection3Ref = collection(this.firestore, 'symptomsFlu');

    return combineLatest([
      collectionData(collection1Ref),
      collectionData(collection2Ref),
      collectionData(collection3Ref)
    ]).pipe(
      map(([data1, data2, data3]) => {
        // Flatten all document arrays and extract values
        const allValues = [...data1, ...data2, ...data3].map(doc => 
          Object.values(doc).filter(value => typeof value === 'string') // Assuming all values you want are strings
        );
        // Flatten the array of arrays into a single array of values
        const flatValues = allValues.flat();
        // Use a Set to extract only unique values, then spread into an array
        const uniqueValues = [...new Set(flatValues)];
        return uniqueValues;
      })
    );
  }

// In your FirestoreDataService
getSymptomsFromCollection(collectionPath: string): Observable<{symptoms: string[], count: number}> {
  const collectionRef = collection(this.firestore, collectionPath);
  return collectionData(collectionRef).pipe(
    map(data => {
      const symptoms = data.map(doc => Object.values(doc)).flat();
      return { symptoms, count: symptoms.length };
    })
  );
}

}
