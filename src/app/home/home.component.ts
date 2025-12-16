// Define uma interface para o item do carrossel, melhor que uma classe simples
import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

// Model for an item in the carousel
export interface CarouselItem {
  image: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterLink, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  items: CarouselItem[] = [
    { image: '/ranger.png', title: 'Conheça  nova Ranger. Verifique novidades.', url: '/lancamento' },
    { image: '/imagem_2.jpg', title: 'Ford — a nossa história', url: 'https://corporate.ford.com/about/history.html' }, // <-- CORREÇÃO 1: História da Ford
    { image: '/imagem_3.jpg', title: 'Nova Ford Bronco Sport 2022', url: 'https://www.ford.com.br/suvs-e-crossovers/bronco-sport/' } // <-- CORREÇÃO 2: Ford Bronco
  ];

  currentIndex = 0;
  intervalMs = 3000;
  private intervalId: number | null = null;

  constructor( ) {}

  ngAfterViewInit(): void {
    // Start carousel after view init
    this.start();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    this.stop();
    this.intervalId = window.setInterval(() => this.next(), this.intervalMs);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  next(): void {
    if (!this.items || this.items.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prev(): void {
    if (!this.items || this.items.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
  }

  goTo(index: number): void {
    if (!this.items || index < 0 || index >= this.items.length) return;
    this.currentIndex = index;
  }
}
