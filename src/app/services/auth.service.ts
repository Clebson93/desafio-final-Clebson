import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 🔑 Chave usada no localStorage (é bom usar uma constante para evitar erros)
  private readonly AUTH_KEY = 'isLogged';

  // O valor inicial é sempre lido do localStorage
  public isLogged = signal<boolean>(false);

  // 💡 NOVO: Construtor para carregar o estado inicial
  constructor() {
    this.checkInitialAuthStatus();
  }

  // Método para carregar o estado do navegador
  private checkInitialAuthStatus(): void {
    try {
      // Verifica se a chave existe no localStorage e se o valor é o que esperamos
      const storedValue = localStorage.getItem(this.AUTH_KEY);
      
      // Se encontrar a chave com o valor '1', define a signal como true
      if (storedValue === '1') {
        this.isLogged.set(true);
      }
    } catch (e) {
      // Em caso de erro (ex: storage indisponível), assume-se deslogado
      console.error("Erro ao ler localStorage:", e);
    }
  }

  login() {
    this.isLogged.set(true);
    try {
      // Salva a chave para indicar que está logado
      localStorage.setItem(this.AUTH_KEY, '1'); 
    } catch {}
  }

  logout() {
    this.isLogged.set(false);
    try {
      // Remove a chave
      localStorage.removeItem(this.AUTH_KEY);
    } catch {}
  }
}