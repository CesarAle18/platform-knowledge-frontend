import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryManagerComponent } from './glossary-manager.component';

describe('GlossaryManagerComponent', () => {
  let component: GlossaryManagerComponent;
  let fixture: ComponentFixture<GlossaryManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlossaryManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlossaryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
