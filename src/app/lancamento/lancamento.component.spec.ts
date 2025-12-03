import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LancamentoComponent } from './lancamento.component';

describe('LancamentoComponent', () => {
  let component: LancamentoComponent;
  let fixture: ComponentFixture<LancamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, LancamentoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select up to two cars', () => {
    expect(component.selected.length).toBe(0);
    component.toggleSelection(0);
    expect(component.selected.length).toBe(1);
    component.toggleSelection(1);
    expect(component.selected.length).toBe(2);
    // selecting a third should replace the second
    component.toggleSelection(2);
    expect(component.selected.length).toBe(2);
  });

  it('should open compare only with two selected', () => {
    component.clearSelection();
    component.toggleSelection(0);
    component.showCompare();
    expect(component.compareOpen).toBe(false);
    component.toggleSelection(1);
    component.showCompare();
    expect(component.compareOpen).toBe(true);
  });
});
