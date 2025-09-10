import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PlanningService } from '../services/planning';

interface Seance {
  periode: string;
  jours: string[];
}

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planning.html',
  styleUrls: ['./planning.css']
})
export class PlanningComponent implements OnInit {
  jours = [1, 2, 3, 4, 5];
  private readonly ADMIN_PASSWORD = 'rachid123';

  planning: Seance[] = [
    { periode: 'P1 : 8h30-9h15', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P2 : 9h15-10h00', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P3 : 10h20-11h05', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P4 : 12h05-12h50', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P5 : 12h50-13h35', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P6 : 13h35-14h20', jours: ['—', '—', '—', '—', '—'] },
  ];

  constructor(
    private http: HttpClient,
    private planningService: PlanningService
  ) {}

  async ngOnInit(): Promise<void> {
    const savedPlanning = await this.planningService.loadPlanning();
    if (savedPlanning) {
      console.log('✅ Planning chargé depuis Firestore :', savedPlanning);
      this.planning = savedPlanning;
    } else {
      console.log('⚠️ Aucun planning trouvé dans Firestore');
    }
  }

  async onCellClick(i: number, j: number, event: MouseEvent) {
    const actuel = this.planning[i].jours[j];

    // Si la case est vide → proposer d’ajouter
    if (actuel === '—') {
      const nom = prompt('Ajouter un rendez-vous :');
      if (nom && nom.trim().length > 0) {
        this.planning[i].jours[j] = nom.trim();
        await this.persist();
      }
      return;
    }

    // Si la case est occupée → demander mot de passe
    const mdp = prompt('🔒 Ce créneau est déjà pris.\nMot de passe requis pour modifier/supprimer :');
    if (mdp !== this.ADMIN_PASSWORD) {
      alert('❌ Mot de passe incorrect.');
      return;
    }

    const action = confirm('✅ Mot de passe correct.\nOK = Modifier\nAnnuler = Supprimer');
    if (action) {
      const nom = prompt('Modifier le rendez-vous :', actuel);
      if (nom && nom.trim().length > 0) {
        this.planning[i].jours[j] = nom.trim();
      }
    } else {
      this.planning[i].jours[j] = '—';
    }

    await this.persist();
  }

  private async persist() {
    try {
      await this.planningService.savePlanning(this.planning);
      console.log('💾 Planning sauvegardé dans Firestore');
    } catch (err) {
      console.error('❌ Erreur lors de la sauvegarde Firestore', err);
    }
  }
}
