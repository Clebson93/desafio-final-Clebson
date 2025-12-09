import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, FormsModule, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  // === VARIÁVEIS DE LOGIN ===
  nome = '';
  senha = '';
  dataAtual = new Date();

  // === NOVO: VARIÁVEL DE CONTROLE DA TELA ===
  isLogin: boolean = true; // TRUE = Mostra Login; FALSE = Mostra Cadastro

  // === NOVO: OBJETO PARA O CADASTRO ===
  registro = {
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmacaoSenha: ''
  };

  constructor(private router: Router, private auth: AuthService) { }

  // Controla se mostra ou esconde a senha
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // === NOVO: FUNÇÃO PARA ALTERNAR ENTRE LOGIN E CADASTRO ===
  toggleMode() {
    this.isLogin = !this.isLogin; 
    
    // Limpa os dados dos formulários ao trocar de tela (melhora a UX)
    this.nome = '';
    this.senha = '';
    this.registro = { nomeCompleto: '', email: '', senha: '', confirmacaoSenha: '' };
  }

  // Função de login existente
  login() {
    console.log('Tentativa de Login:', this.nome);
    if (this.nome !== 'admin' || this.senha !== '123456') {
      alert('Nome ou senha Invalidos');
    } else {
      this.auth.login();
      this.router.navigate(['/home']);
    }
  }

  // === FUNÇÃO PARA TRATAR O CADASTRO ===
  register() {
    console.log('Dados de Cadastro:', this.registro);
    
    // 1. Validação básica (campos obrigatórios)
    if (!this.registro.nomeCompleto || !this.registro.email || !this.registro.senha || !this.registro.confirmacaoSenha) {
         alert('Preencha todos os campos obrigatórios.');
         return;
    }

    // 2. Validação do Caractere '@' no E-mail
    if (!this.registro.email.includes('@')) {
        alert('O campo E-mail deve conter o caractere "@".');
        return;
    }

    // 3. Validação do Domínio Específico (@SynthID)
    const requiredDomain = '@SynthID';
    if (!this.registro.email.endsWith(requiredDomain)) {
        alert(`O e-mail deve ser obrigatoriamente do domínio ${requiredDomain}.`);
        return;
    }
    
    // 4. Validação de Senhas
    if (this.registro.senha !== this.registro.confirmacaoSenha) {
      alert('A Senha e a Confirmação de Senha não coincidem.');
      return;
    }

    // ** Lógica de envio para a API viria aqui **
    
    // Alerta de sucesso
    alert(`Usuário ${this.registro.nomeCompleto} cadastrado com sucesso! Retornando para Login.`);
    
    // LINHA QUE FAZ VOLTAR PARA A TELA DE LOGIN AUTOMATICAMENTE
    this.toggleMode(); 
  }
}