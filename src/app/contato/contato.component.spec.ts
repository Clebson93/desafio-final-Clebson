import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ContatoComponent } from './contato.component';

describe('ContatoComponent', () => {
  let component: ContatoComponent;
  let fixture: ComponentFixture<ContatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ContatoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require LGPD checkbox to be checked', () => {
    component.form.patchValue({ nome: 'A', sobrenome: 'B', email: 'a@b.com', cpf: '123', telefone: '123', contato: 'TELEFONE', aceitaLGPD: false });
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ aceitaLGPD: true });
    expect(component.form.valid).toBeTrue();
  });
});
