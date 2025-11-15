import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nome = '';
  email = '';
  senha = '';
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = null;
    this.success = null;
    this.loading = true;
    this.auth.register(this.nome, this.email, this.senha).subscribe({
      next: _ => {
        this.loading = false;
        this.success = 'Registrado com sucesso. Você pode entrar agora.';
        // opcional: redirecionar para login após 1.5s
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Falha ao registrar. Verifique os dados.';
      }
    });
  }
}
