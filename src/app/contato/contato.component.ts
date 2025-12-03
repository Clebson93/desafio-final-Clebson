import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent {
  form!: FormGroup;

  submitted = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
      contato: ['TELEFONE', Validators.required],
      aceitaLGPD: [false, Validators.requiredTrue],
      aceitaPromocao: [false]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      // mark all controls as touched to show validation
      Object.values(this.form.controls).forEach((control: any) => control.markAsTouched());
      return;
    }

    const value = this.form.getRawValue();

    // Save to localStorage to simulate a backend call
    const store = JSON.parse(localStorage.getItem('contatos') || '[]');
    store.push({ ...value, createdAt: new Date().toISOString() });
    localStorage.setItem('contatos', JSON.stringify(store));

    // simple confirmation - in a real app we'd call an API
    alert(`Obrigado ${value.nome} — seus dados foram enviados com sucesso.`);

    this.form.reset({ contato: 'TELEFONE', aceitaLGPD: false, aceitaPromocao: false });
    this.submitted = false;
  }
}
