import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoDetailComponent } from './servico-detail.component';

describe('ServicoDetailComponent', () => {
  let component: ServicoDetailComponent;
  let fixture: ComponentFixture<ServicoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
