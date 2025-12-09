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