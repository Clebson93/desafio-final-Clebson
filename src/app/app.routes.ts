import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { LancamentoComponent } from './lancamento/lancamento.component';
import { authGuard  } from './guards/auth.guard';
import { ContatoComponent } from './contato/contato.component';


export const routes: Routes = [
    {path: "", pathMatch: 'full', redirectTo: 'login'},
    {path:'login', component: LoginComponent}, 
    
    {path:'home', component: HomeComponent, canActivate: [authGuard]},

    {path:'lancamento', component: LancamentoComponent, canActivate: [authGuard]},

    // Contato should be public — remove the authGuard so anyone can view the contact page
    {path:'contato', component: ContatoComponent, canActivate: [authGuard]},

    {path:'dashboard', component: DashboardComponent, canActivate: [authGuard]},
];
