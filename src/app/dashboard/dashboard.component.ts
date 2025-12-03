import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Veiculo } from '../models/veiculo.model';
import { VehicleData } from '../models/vehicleData.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarroVin } from '../utils/carroVinInterface';
import {  Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MenuComponent } from "../menu/menu.component";

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, CommonModule, MenuComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vehicles: Veiculo[] = [];
  selectedVehicle!: Veiculo;
  vehicleData!: VehicleData;

  carVin!: CarroVin;
  reqVin!: Subscription;

  selectCarForms = new FormGroup({
    carId: new FormControl(''),
  });

  vinForm = new FormGroup({
    vin: new FormControl(''),
  });

  onChange() {
    this.vinForm.controls.vin.valueChanges.subscribe((value) => {
      this.reqVin = this.dashboardservice
        .buscarVin(value as string)
        .subscribe((res) => {
          this.carVin = res;
        });
    });
  }

  constructor(private dashboardservice: DashboardService) { }

  ngOnInit(): void {
    this.dashboardservice.getVehicles().subscribe((res) => {
      // API may return an object { vehicles: [...] } or an array [...]
      // log at debug level to avoid noisy console output during normal app usage
      console.debug('getVehicles response:', res);
      if (res && (res as any).vehicles) {
        this.vehicles = (res as any).vehicles as Veiculo[];
      } else if (Array.isArray(res)) {
        this.vehicles = res as Veiculo[];
      } else {
        this.vehicles = [];
      }

      // select the first vehicle by default (optional)
      if (this.vehicles.length > 0) {
        this.selectedVehicle = this.vehicles[0];
      }
    });

    // Map selected id to the actual vehicle object instead of indexing by id-1
    this.selectCarForms.controls.carId.valueChanges.subscribe((id) => {
      if (id === null || id === undefined || id === '') {
        this.selectedVehicle = undefined as any;
        return;
      }
      const found = this.vehicles.find((v) => String(v.id) === String(id));
      if (found) {
        this.selectedVehicle = found;
      }
    });

    this.onChange();
  }

  ngOnDestroy(): void {
    // cleanup vin subscription if set
    if (this.reqVin) {
      this.reqVin.unsubscribe();
    }
  }

  // ngOnDestroy(): void {
  //   this.reqVin.unsubscribe();
  // }
  }



