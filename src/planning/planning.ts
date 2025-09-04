import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
})
export class PlanningComponent implements OnInit {
  jours = [1, 2, 3, 4, 5];
  
  private readonly ADMIN_PASSWORD = 'rachid123'; 

  activites: Activite[] = []; // Chargées depuis JSON

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Charger le planning sauvegardé
    const saved = localStorage.getItem('planning');
    if (saved) {
      const savedPlanning: Seance[] = JSON.parse(saved);
      this.planning.forEach((seance, index) => {
        if (savedPlanning[index]) {
          seance.jours = savedPlanning[index].jours;
        }
      });
    }

    // Charger les activités depuis le JSON
this.http.get<Activite[]>('/assets/activities.json').subscribe({
  next: (data) => (this.activites = data),
  error: (err) => console.error('Erreur de chargement des activités', err),
});

  }

  onCellClick(i: number, j: number, event: MouseEvent) {
    const actuel = this.planning[i].jours[j];

    // Cas 1 : créneau vide → libre
    if (actuel === '—') {
      const nom = prompt("Saisir le nom de l'enseignant");
      if (nom && nom.trim().length > 0) {
        this.planning[i].jours[j] = nom.trim();
        this.persist();
      }
      return;
    }

    // Cas 2 : créneau occupé → demande mot de passe
    const mdp = prompt('🔒 Ce créneau est déjà pris.\nMot de passe requis pour modifier/supprimer :');
    if (mdp !== this.ADMIN_PASSWORD) {
      alert('❌ Mot de passe incorrect.');
      return;
    }

    // Si mot de passe correct → choix entre modifier ou supprimer
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

  private persist() {
    localStorage.setItem('planning', JSON.stringify(this.planning));
  }
}
