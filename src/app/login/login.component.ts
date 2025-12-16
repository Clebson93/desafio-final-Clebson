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

  // === VARIÁVEL DE CONTROLE DA TELA ===
  isLogin: boolean = true;

  // === OBJETO PARA O CADASTRO ===
  registro = {
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmacaoSenha: ''
  };

  // === VARIÁVEL PARA MENSAGEM DE ERRO ===
  mensagemErro = '';

  constructor(private router: Router, private auth: AuthService) { }

  // Controla se mostra ou esconde a senha
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // === FUNÇÃO PARA ALTERNAR ENTRE LOGIN E CADASTRO ===
  toggleMode() {
    this.isLogin = !this.isLogin; 
    this.mensagemErro = ''; // Limpa mensagem de erro
    
    // Limpa os dados dos formulários
    this.nome = '';
    this.senha = '';
    this.registro = { nomeCompleto: '', email: '', senha: '', confirmacaoSenha: '' };
  }

  // Função de login existente
  login() {
    console.log('Tentativa de Login:', this.nome);
    if (this.nome !== 'admin' || this.senha !== '123456') {
      alert('Nome ou senha inválidos');
    } else {
      this.auth.login();
      this.router.navigate(['/home']);
    }
  }

  // === FUNÇÃO PARA TRATAR O CADASTRO ===
  register() {
    console.log('=== INICIANDO CADASTRO ===');
    console.log('Dados recebidos:', this.registro);
    
    // Reset mensagem de erro
    this.mensagemErro = '';
    
    // 1. Validação básica (campos obrigatórios)
    if (!this.registro.nomeCompleto?.trim() || 
        !this.registro.email?.trim() || 
        !this.registro.senha || 
        !this.registro.confirmacaoSenha) {
      this.mensagemErro = 'Preencha todos os campos obrigatórios.';
      alert(this.mensagemErro);
      return;
    }

    // 2. Remover espaços do e-mail
    const emailLimpo = this.registro.email.trim();
    console.log('E-mail limpo:', emailLimpo);
    
    // 3. Validação do formato básico de e-mail
    if (!emailLimpo.includes('@')) {
      this.mensagemErro = 'O campo E-mail deve conter o caractere "@".';
      alert(this.mensagemErro);
      return;
    }

    // 4. Extrair o domínio
    const dominio = emailLimpo.substring(emailLimpo.indexOf('@'));
    console.log('Domínio extraído:', dominio);
    
    // ** A VALIDAÇÃO DO DOMÍNIO @SynthID FOI REMOVIDA AQUI **
    
    // 6. Validação de Senhas
    if (this.registro.senha !== this.registro.confirmacaoSenha) {
      this.mensagemErro = 'A Senha e a Confirmação de Senha não coincidem.';
      alert(this.mensagemErro);
      return;
    }

    // 7. Validação de força da senha
    if (this.registro.senha.length < 6) {
      this.mensagemErro = 'A senha deve ter pelo menos 6 caracteres.';
      alert(this.mensagemErro);
      return;
    }

    // CADASTRO BEM-SUCEDIDO
    console.log('=== CADASTRO APROVADO ===');
    console.log('Nome:', this.registro.nomeCompleto);
    console.log('E-mail válido:', emailLimpo);
    console.log('Domínio válido:', dominio);
    
    // ** Aqui viria a lógica para enviar para a API **
    
    // Alerta de sucesso
    alert(`✅ CADASTRO REALIZADO COM SUCESSO!\n\nUsuário: ${this.registro.nomeCompleto}\nE-mail: ${emailLimpo}\n\nRedirecionando para login...`);
    
    // Limpa o formulário
    this.registro = { nomeCompleto: '', email: '', senha: '', confirmacaoSenha: '' };
    
    // Volta para o login
    this.isLogin = true;
  }
}

