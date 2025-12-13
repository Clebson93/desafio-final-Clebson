import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarroVin } from '../utils/carroVinInterface';
import { VeiculosAPI, Veiculo } from '../models/veiculo.model'


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:3001';
  private readonly SELECTED_VEHICLE_KEY = 'selectedVehicleId'; // Chave para o LocalStorage

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<VeiculosAPI>{
    return this.http.get<VeiculosAPI> (`${this.baseUrl}/vehicles`)
  }

  buscarVin(codigoVin: string): Observable<CarroVin>{
    const reqVin = this.http.post<CarroVin>(`${this.baseUrl}/vehicleData`, {vin: codigoVin})
    return reqVin
  }
  
  // -----------------------------------------------------------
  // 🚨 NOVOS MÉTODOS DE GERENCIAMENTO DE ESTADO
  // -----------------------------------------------------------

  /**
   * Salva o ID do veículo selecionado no LocalStorage.
   */
  setVeiculoAtivo(veiculoId: number): void {
    if (veiculoId) {
      localStorage.setItem(this.SELECTED_VEHICLE_KEY, String(veiculoId));
    } else {
      localStorage.removeItem(this.SELECTED_VEHICLE_KEY);
    }
  }

  /**
   * Retorna o ID do veículo ativo (salvo no LocalStorage).
   */
  getVeiculoAtivoId(): number | null {
    const id = localStorage.getItem(this.SELECTED_VEHICLE_KEY);
    return id ? Number(id) : null;
  }
}