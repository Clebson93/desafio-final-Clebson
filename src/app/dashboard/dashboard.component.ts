import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Veiculo } from '../models/veiculo.model';
import { VehicleData } from '../models/vehicleData.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarroVin } from '../utils/carroVinInterface';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MenuComponent } from "../menu/menu.component";

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, CommonModule, MenuComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  vehicles: Veiculo[] = [];
  selectedVehicle!: Veiculo;
  vehicleData!: VehicleData;

  carVin!: CarroVin;
  reqVin!: Subscription;
  vinSubscription!: Subscription;

  // Inicialização com tipagem correta para evitar erros
  selectCarForms = new FormGroup({
    carId: new FormControl<string | null>(null),
  });

  vinForm = new FormGroup({
    vin: new FormControl<string | null>(null),
  });

  constructor(private dashboardservice: DashboardService) { }
  
  // ----------------------------------------------------------------------------------
  // LÓGICA DE SINCRONIZAÇÃO VIN -> VEÍCULO 
  // ----------------------------------------------------------------------------------
  onChangeVin() {
    this.vinSubscription = this.vinForm.controls.vin.valueChanges.subscribe((value) => {
      
      console.log('1. VIN digitado:', value); 
      
      if (!value || value.length < 5) {
        this.carVin = undefined as any;
        return;
      }
      
      this.reqVin = this.dashboardservice
        .buscarVin(value)
        .subscribe({
          next: (res) => {
             this.carVin = res;
          
            const vehicleIdFromVin = res.id; 
            
            console.log('2. ID do veículo retornado pela API (res.id):', vehicleIdFromVin); 
            
            if (vehicleIdFromVin) {
              const idToSelect = Number(vehicleIdFromVin); 
              console.log('3. ID a ser selecionado (como número):', idToSelect); 
              
              // 🚨 CORREÇÃO DE BUSCA: Usando String() para garantir a comparação estável
              const foundVehicle = this.vehicles.find(v => String(v.id) === String(idToSelect));

              if (foundVehicle) {
                
                console.log('4. Veículo encontrado na lista:', foundVehicle.vehicle); 
                
                this.selectedVehicle = foundVehicle;
                
                // Sincroniza o dropdown
                this.selectCarForms.controls.carId.setValue(
                  String(foundVehicle.id),
                  { emitEvent: false } // Impede loop infinito
                );
                
                // 🚨 CORREÇÃO DE TIPAGEM: Garantindo que o ID seja um Number para o setVeiculoAtivo
                this.dashboardservice.setVeiculoAtivo(Number(foundVehicle.id)); 

              } else {
                  console.warn(`Veículo com ID ${idToSelect} (do VIN) não encontrado na lista de veículos disponíveis. Lista carregada:`, this.vehicles);
              }
            }
          },
          error: (err) => {
            console.error('Erro ao buscar VIN:', err);
            this.carVin = undefined as any;
          }
        });
    });
  }


  ngOnInit(): void {
    
    // ----------------------------------------------------------------------------------
    // 1. CARREGAMENTO E SELEÇÃO INICIAL DE VEÍCULOS
    // ----------------------------------------------------------------------------------

    this.dashboardservice.getVehicles().subscribe((res) => {
      console.debug('getVehicles response:', res);
      
      let allVehicles: Veiculo[];
      if (res && (res as any).vehicles) {
        allVehicles = (res as any).vehicles as Veiculo[];
      } else if (Array.isArray(res)) {
        allVehicles = res as Veiculo[];
      } else {
        allVehicles = [];
      }
      this.vehicles = allVehicles;

      const activeVehicleId = this.dashboardservice.getVeiculoAtivoId();
      
      let vehicleToSelect: Veiculo | undefined;
      
      // Tenta encontrar o veículo salvo
      if (activeVehicleId) {
        vehicleToSelect = this.vehicles.find(v => v.id === activeVehicleId);
      }

      // Se não encontrou o salvo, seleciona o primeiro
      if (!vehicleToSelect && this.vehicles.length > 0) {
        vehicleToSelect = this.vehicles[0];
      }

      // Define o veículo ativo no estado e no dropdown
      if (vehicleToSelect) {
        this.selectedVehicle = vehicleToSelect;
        
        this.selectCarForms.controls.carId.setValue(
          String(this.selectedVehicle.id), 
          { emitEvent: false } 
        ); 
        
        // 🚨 CORREÇÃO DE TIPAGEM: Garantindo que o ID seja um Number para o setVeiculoAtivo
        this.dashboardservice.setVeiculoAtivo(Number(this.selectedVehicle.id)); 
      }
      
      // CHAMA A ESCUTA DO VIN APÓS O CARREGAMENTO BEM SUCEDIDO
      this.onChangeVin(); 
    });

    // ----------------------------------------------------------------------------------
    // 2. LÓGICA DE SELEÇÃO MANUAL PELO DROPDOWN
    // ----------------------------------------------------------------------------------
    this.selectCarForms.controls.carId.valueChanges.subscribe((id) => {
      if (!id) {
        this.selectedVehicle = undefined as any;
        this.dashboardservice.setVeiculoAtivo(undefined as any);
        return;
      }
      
      // Procura o veículo pelo ID selecionado no dropdown
      const found = this.vehicles.find((v) => String(v.id) === String(id));
      if (found) {
        this.selectedVehicle = found;
        // 🚨 CORREÇÃO DE TIPAGEM: Garantindo que o ID seja um Number para o setVeiculoAtivo
        this.dashboardservice.setVeiculoAtivo(Number(found.id)); 
      }
    });
  }

  ngOnDestroy(): void {
    if (this.reqVin) {
      this.reqVin.unsubscribe();
    }
    if (this.vinSubscription) {
      this.vinSubscription.unsubscribe();
    }
  }
}