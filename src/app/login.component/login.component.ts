import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  senha = '';
  remember = true;
  showPassword = false;
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  toggleShow() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    this.error = null;
    if (!this.email) {
      this.error = 'Email é obrigatório.';
      return;
    }
    if (!this.senha || this.senha.length < 1) {
      this.error = 'Senha é obrigatória.';
      return;
    }
    this.loading = true;
    this.auth.login(this.email, this.senha, this.remember).subscribe({
      next: token => {
        this.loading = false;
        if (token) {
          this.router.navigate(['/servicos']);
        } else {
          this.error = 'Resposta inesperada do servidor.';
        }
      },
      error: err => {
        this.loading = false;
        const status = err?.status;
        if (status === 401 || status === 403) {
          this.error = 'Credenciais inválidas.';
        } else {
          this.error = err?.error?.message || 'Erro ao conectar com o servidor.';
        }
      }
    });
  }
}
