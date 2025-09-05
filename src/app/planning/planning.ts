import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PlanningService } from '../services/planning';

interface Seance {
  periode: string;
  jours: string[];
}

interface Activite {
  titre: string;
  objectif: string;
}

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planning.html',
  styleUrls: ['./planning.css'],
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('visible', style({ height: '*', opacity: 1 })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class PlanningComponent implements OnInit {
  showActivites = true;
  jours = [1, 2, 3, 4, 5];
  private readonly ADMIN_PASSWORD = 'rachid123';

  activites: Activite[] = [];
  planning: Seance[] = [
    { periode: 'P1 : 8h30-9h15', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P2 : 9h15-10h00', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'Récréation : 10h00-10h20', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P3 : 10h20-11h05', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'Dîner : 11h05 - 12h05', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P4 : 12h05-12h50', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P5 : 12h50-13h35', jours: ['—', '—', '—', '—', '—'] },
    { periode: 'P6 : 13h35-14h20', jours: ['—', '—', '—', '—', '—'] },
  ];

  constructor(
    private http: HttpClient,
    private planningService: PlanningService
  ) {}

  async ngOnInit(): Promise<void> {
    // 🔥 Charger le planning depuis Firestore
    const savedPlanning = await this.planningService.loadPlanning();
    if (savedPlanning) {
      console.log('✅ Planning chargé depuis Firestore :', savedPlanning);
      this.planning = savedPlanning;
    } else {
      console.log('⚠️ Aucun planning trouvé dans Firestore');
    }

    // Charger les activités depuis le JSON
    this.http.get<Activite[]>('/assets/activities.json').subscribe({
      next: (data) => (this.activites = data),
      error: (err) => console.error('Erreur de chargement des activités', err),
    });
  }

  toggleActivites() {
    this.showActivites = !this.showActivites;
  }

  onCellClick(i: number, j: number, event: MouseEvent) {
    const actuel = this.planning[i].jours[j];

    if (actuel === '—') {
      const nom = prompt("Saisir le nom de l'enseignant");
      if (nom && nom.trim().length > 0) {
        this.planning[i].jours[j] = nom.trim();
        this.persist();
      }
      return;
    }

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

    this.persist();
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
