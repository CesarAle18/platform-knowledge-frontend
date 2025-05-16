import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarEvent } from '../../../core/models/calendar-event.model';
import { User } from '../../../core/models/user.model';
import { Process } from '../../../core/models/process.model';
import { Concept } from '../../../core/models/concept.model';
import { File } from '../../../core/models/file.model';
import { CalendarService } from '../../../core/services/calendar.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProcessService } from '../../../core/services/process.service';
import { CommonModule } from '@angular/common';

// PrimeNG Components
import { CalendarModule } from 'primeng/calendar';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';

// FullCalendar
import { FullCalendarComponent } from '@fullcalendar/angular';
import {
  CalendarOptions,
  EventClickArg,
  DateSelectArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    FullCalendarModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    ToolbarModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions!: CalendarOptions;
  events: any[] = [];
  eventDialog: boolean = false;
  deleteEventDialog: boolean = false;
  eventForm: FormGroup;
  selectedEvent: CalendarEvent | null = null;
  users: User[] = [];
  processes: Process[] = [];
  concepts: Concept[] = [];
  relatedTypes: any[] = [
    { label: 'Proceso', value: 'process' },
    { label: 'Concepto', value: 'concept' },
    { label: 'Archivo', value: 'file' },
  ];
  relatedItems: any[] = [];
  currentUser: any;
  loading: boolean = true;

  constructor(
    private calendarService: CalendarService,
    private authService: AuthService,
    private processService: ProcessService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.eventForm = this.formBuilder.group({
      id: [null],
      title: ['', Validators.required],
      description: [''],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      isAllDay: [false],
      userId: [null, Validators.required],
      relatedType: [null],
      relatedId: [null],
    });
  }

  ngOnInit() {
    this.configureCalendar();
    this.loadCalendarEvents();
    this.loadUsers();
    this.loadProcesses();
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user && user.id) {
        this.eventForm.patchValue({
          userId: user.id,
        });
      } else {
        this.eventForm.patchValue({
          userId: null,
        });
      }
    });
  }

  configureCalendar() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      locale: esLocale,
      events: this.events,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.handleEventDrop.bind(this),
      eventResize: this.handleEventResize.bind(this),
      height: 'auto',
    };
  }

  loadCalendarEvents() {
    this.loading = true;
    this.calendarService.getAll().subscribe({
      next: (response) => {
        this.events = response.events.map((event) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          allDay: event.isAllDay,
          extendedProps: {
            description: event.description,
            userId: event.userId,
            relatedType: event.relatedType,
            relatedId: event.relatedId,
          },
          backgroundColor: this.getEventColor(event.relatedType),
        }));

        if (this.calendarComponent && this.calendarComponent.getApi()) {
          this.calendarComponent.getApi().removeAllEvents();
          this.calendarComponent.getApi().addEventSource(this.events);
        }

        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los eventos',
          life: 3000,
        });
        this.loading = false;
      },
    });
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los usuarios',
          life: 3000,
        });
      },
    });
  }
  loadProcesses() {
    this.processService.getAll().subscribe({
      next: (response) => {
        this.processes = response.processes;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los procesos',
          life: 3000,
        });
      },
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.eventForm.reset();
    const startDate = new Date(selectInfo.start);
    const endDate = new Date(selectInfo.end);

    // Reducir un día si es un evento de todo el día
    if (selectInfo.allDay) {
      endDate.setDate(endDate.getDate() - 1);
    }

    this.eventForm.patchValue({
      startDate: startDate,
      endDate: endDate,
      isAllDay: selectInfo.allDay,
      userId: this.currentUser?.id,
    });

    this.eventDialog = true;
  }

  handleEventClick(clickInfo: EventClickArg) {
    const eventData = clickInfo.event;
    this.selectedEvent = {
      id: Number(eventData.id),
      title: eventData.title,
      description: eventData.extendedProps['description'],
      startDate: new Date(eventData.start || ''),
      endDate: new Date(eventData.end || eventData.start || ''),
      isAllDay: eventData.allDay,
      userId: eventData.extendedProps['userId'],
      relatedType: eventData.extendedProps['relatedType'],
      relatedId: eventData.extendedProps['relatedId'],
    };

    this.eventForm.patchValue({
      id: this.selectedEvent.id,
      title: this.selectedEvent.title,
      description: this.selectedEvent.description,
      startDate: this.selectedEvent.startDate,
      endDate: this.selectedEvent.endDate,
      isAllDay: this.selectedEvent.isAllDay,
      userId: this.selectedEvent.userId,
      relatedType: this.selectedEvent.relatedType,
      relatedId: this.selectedEvent.relatedId,
    });

    // Cargar lista de elementos relacionados según el tipo
    if (this.selectedEvent.relatedType) {
      this.onRelatedTypeChange(this.selectedEvent.relatedType);
    }

    this.eventDialog = true;
  }

  handleEventDrop(eventDropInfo: any) {
    const event = eventDropInfo.event;
    const eventId = Number(event.id);

    this.calendarService.getById(eventId).subscribe({
      next: (existingEvent: CalendarEvent) => {
        const eventData: CalendarEvent = {
          ...existingEvent,
          startDate: event.start,
          endDate: event.end || event.start,
          isAllDay: event.allDay,
        };

        // Actualizar el evento
        this.calendarService.update(eventId, eventData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Evento actualizado',
              life: 3000,
            });
          },
          error: (error) => {
            eventDropInfo.revert();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar el evento',
              life: 3000,
            });
          },
        });
      },
      error: (error) => {
        eventDropInfo.revert();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener el evento',
          life: 3000,
        });
      },
    });
  }
  handleEventResize(eventResizeInfo: any) {
    const event = eventResizeInfo.event;

    // Verificar que event.id exista y sea válido
    const eventId = event.id ? Number(event.id) : null;
    if (!eventId) {
      eventResizeInfo.revert();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo identificar el evento',
        life: 3000,
      });
      return;
    }

    // Obtener el evento completo desde el servicio
    this.calendarService.getById(eventId).subscribe({
      next: (existingEvent: CalendarEvent) => {
        const eventData: CalendarEvent = {
          ...existingEvent, // Copia todas las propiedades del evento existente
          startDate: event.start, // Actualiza startDate
          endDate: event.end || event.start, // Actualiza endDate, usa start si end es null
        };

        this.calendarService.update(eventData.id, eventData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Evento actualizado',
              life: 3000,
            });
          },
          error: (error) => {
            eventResizeInfo.revert();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar el evento',
              life: 3000,
            });
          },
        });
      },
      error: (error) => {
        eventResizeInfo.revert();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener el evento',
          life: 3000,
        });
      },
    });
  }
  onRelatedTypeChange(relatedType: string) {
    switch (relatedType) {
      case 'process':
        this.relatedItems = this.processes.map((p) => ({
          label: p.title,
          value: p.id,
        }));
        break;
      case 'concept':
        // Aquí iría la carga de conceptos desde un servicio
        this.relatedItems = [];
        break;
      case 'file':
        // Aquí iría la carga de archivos desde un servicio
        this.relatedItems = [];
        break;
      default:
        this.relatedItems = [];
    }
  }

  saveEvent() {
    if (this.eventForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos',
        life: 3000,
      });
      return;
    }

    const eventData = this.eventForm.value;

    if (eventData.id) {
      this.calendarService.update(eventData.id, eventData).subscribe({
        next: (updatedEvent) => {
          this.loadCalendarEvents();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evento actualizado',
            life: 3000,
          });
          this.eventDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el evento',
            life: 3000,
          });
        },
      });
    } else {
      this.calendarService.create(eventData).subscribe({
        next: (newEvent) => {
          this.loadCalendarEvents();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evento creado',
            life: 3000,
          });
          this.eventDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el evento',
            life: 3000,
          });
        },
      });
    }
  }

  deleteEvent() {
    if (this.selectedEvent && this.selectedEvent.id) {
      this.deleteEventDialog = true;
    }
  }

  confirmDeleteEvent() {
    if (this.selectedEvent && this.selectedEvent.id) {
      this.calendarService.delete(this.selectedEvent.id).subscribe({
        next: () => {
          this.loadCalendarEvents();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evento eliminado',
            life: 3000,
          });
          this.deleteEventDialog = false;
          this.eventDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el evento',
            life: 3000,
          });
        },
      });
    }
  }

  hideEventDialog() {
    this.eventDialog = false;
    this.eventForm.reset();
  }

  getEventColor(relatedType: string | undefined): string {
    switch (relatedType) {
      case 'process':
        return '#4CAF50'; // Verde
      case 'concept':
        return '#2196F3'; // Azul
      case 'file':
        return '#FFC107'; // Amarillo
      default:
        return '#9C27B0'; // Morado (default)
    }
  }

  getUserName(userId: number | undefined): string {
    if (!userId) return 'Sin asignar';
    const user = this.users.find((u) => u.id === userId);
    return user ? user.name : 'Sin asignar';
  }

  getRelatedItemName(
    relatedType: string | undefined,
    relatedId: number | undefined
  ): string {
    if (!relatedType || !relatedId) return 'Sin relación';

    switch (relatedType) {
      case 'process':
        const process = this.processes.find((p) => p.id === relatedId);
        return process ? process.title : 'Proceso no encontrado';
      // Implementar para conceptos y archivos
      default:
        return 'Sin relación';
    }
  }
}
