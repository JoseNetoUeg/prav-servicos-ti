import { Component, signal } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.bootstrap.html',
  standalone: false,
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('prav-frontend-servico');
  constructor(private auth: AuthService, private router: Router) {}

  userName(): string | null {
    const u = this.auth.getUser();
    if (!u) return null;
    // Mostrar somente o nome no botão Sair. Não exibir email aqui.
    return u.nome || null;
  }

  isLogged(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
