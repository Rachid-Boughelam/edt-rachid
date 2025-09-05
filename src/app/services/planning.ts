import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  constructor(private firestore: Firestore) {}

  async savePlanning(planning: any): Promise<void> {
    try {
      const ref = doc(this.firestore, 'plannings/default');
      await setDoc(ref, { planning });
      console.log('💾 Planning sauvegardé avec succès dans Firestore');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du planning :', error);
      throw error;
    }
  }

  async loadPlanning(): Promise<any | null> {
    try {
      const ref = doc(this.firestore, 'plannings/default');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        console.log('✅ Planning chargé depuis Firestore :', data);
        return data['planning'];
      } else {
        console.warn('⚠️ Aucun planning trouvé dans Firestore');
        return null;
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du planning :', error);
      throw error;
    }
  }
}
