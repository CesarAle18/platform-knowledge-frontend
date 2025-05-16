import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagerComponent } from './process-manager.component';

describe('ProcessManagerComponent', () => {
  let component: ProcessManagerComponent;
  let fixture: ComponentFixture<ProcessManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
