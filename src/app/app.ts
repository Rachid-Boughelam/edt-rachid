import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,          // 👈 obligatoire pour un composant standalone
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']   // 👈 styleUrl → styleUrls (au pluriel)
})
export class AppComponent {
  protected readonly title = signal('edt-rachid');
}
