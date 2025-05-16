import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptManagerComponent } from './concept-manager.component';

describe('ConceptManagerComponent', () => {
  let component: ConceptManagerComponent;
  let fixture: ComponentFixture<ConceptManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConceptManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConceptManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
