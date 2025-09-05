import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  constructor(private firestore: Firestore) {}

  async savePlanning(planning: any) {
    const ref = doc(this.firestore, 'plannings/default'); 
    await setDoc(ref, { planning });
  }

  async loadPlanning() {
    const ref = doc(this.firestore, 'plannings/default');
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data()['planning'] : null;
  }
}
