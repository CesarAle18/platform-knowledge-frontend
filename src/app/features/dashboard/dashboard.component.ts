import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Category } from '../../core/models/category.model';
import { Process } from '../../core/models/process.model';
import { Concept } from '../../core/models/concept.model';
import { File } from '../../core/models/file.model';
import { CalendarEvent } from '../../core/models/calendar-event.model';
import { CategoryService } from '../../core/services/category.service';
import { ProcessService } from '../../core/services/process.service';
import { ConceptService } from '../../core/services/concept.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { CalendarService } from '../../core/services/calendar.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CardModule, ChartModule, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  recentFiles: File[] = [];
  upcomingEvents: CalendarEvent[] = [];
  categoryStats: any;
  fileTypeStats: any;
  contentStats: any;

  constructor(
    private categoryService: CategoryService,
    private processService: ProcessService,
    private conceptService: ConceptService,
    private fileUploadService: FileUploadService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.loadRecentFiles();
    this.loadUpcomingEvents();
    this.loadCategoryStats();
    this.loadFileTypeStats();
    this.loadContentStats();
  }

  loadRecentFiles(): void {
    this.fileUploadService.getRecentFiles(5).subscribe({
      next: (files) => {
        this.recentFiles = files;
      },
      error: (error) => {
        console.error('Error loading recent files:', error);
      },
    });
  }

  loadUpcomingEvents(): void {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 14); // Próximos 14 días

    this.calendarService.getEvents(today, endDate).subscribe({
      next: (events) => {
        this.upcomingEvents = events;
      },
      error: (error) => {
        console.error('Error loading upcoming events:', error);
      },
    });
  }

  loadCategoryStats(): void {
    this.categoryService.getCategoryStats().subscribe({
      next: (stats) => {
        const labels = stats.map((item: any) => item.name);
        const data = stats.map((item: any) => item.count);

        this.categoryStats = {
          labels,
          datasets: [
            {
              label: 'Contenido por categoría',
              data,
              backgroundColor: [
                '#42A5F5',
                '#66BB6A',
                '#FFA726',
                '#26C6DA',
                '#7E57C2',
                '#EC407A',
                '#AB47BC',
                '#26A69A',
                '#D4E157',
                '#9CCC65',
              ],
            },
          ],
        };
      },
    });
  }

  loadFileTypeStats(): void {
    this.fileUploadService.getFileTypeStats().subscribe({
      next: (stats) => {
        const labels = [
          'Documentos',
          'Imágenes',
          'Videos',
          'Presentaciones',
          'Otros',
        ];
        const data = [
          stats.document || 0,
          stats.image || 0,
          stats.video || 0,
          stats.presentation || 0,
          stats.other || 0,
        ];

        this.fileTypeStats = {
          labels,
          datasets: [
            {
              label: 'Archivos por tipo',
              data,
              backgroundColor: [
                '#42A5F5',
                '#66BB6A',
                '#FFA726',
                '#26C6DA',
                '#7E57C2',
              ],
            },
          ],
        };
      },
    });
  }

  loadContentStats(): void {
    Promise.all([
      this.fileUploadService.getTotalCount(),
      this.conceptService.getTotalCount(),
      this.processService.getTotalCount(),
    ]).then(([filesCount, conceptsCount, processesCount]) => {
      this.contentStats = {
        labels: ['Archivos', 'Conceptos', 'Procesos'],
        datasets: [
          {
            label: 'Total de contenido',
            data: [filesCount, conceptsCount, processesCount],
            backgroundColor: ['#42A5F5', '#FFA726', '#66BB6A'],
          },
        ],
      };
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
