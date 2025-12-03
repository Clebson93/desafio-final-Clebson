// Define uma interface para o item do carrossel, melhor que uma classe simples
import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { RouterLink } from '@angular/router';

// Model for an item in the carousel
export interface CarouselItem {
  image: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  items: CarouselItem[] = [
    { image: '/imagem_1.jpg', title: 'Esta é a nova Ranger Ford 2022. Verifique novidades.', url: '/lancamento' },
    { image: '/imagem_2.jpg', title: 'Ford — a nossa história', url: '/lancamento' },
    { image: '/imagem_3.jpg', title: 'Nova Ford Bronco Sport 2022', url: '/lancamento' }
  ];

  currentIndex = 0;
  intervalMs = 3000;
  private intervalId: number | null = null;

  constructor() {}

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
