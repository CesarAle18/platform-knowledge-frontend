import { Routes } from '@angular/router';
import { ContentListComponent } from './content-list/content-list.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { EditorGuard } from '../../core/guards/editor.guard';

export const CONTENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ContentListComponent,
        title: 'Contenido - Plataforma de Conocimiento',
      },
      {
        path: 'upload',
        component: FileUploadComponent,
        canActivate: [EditorGuard],
        title: 'Subir Archivo - Plataforma de Conocimiento',
      },
      {
        path: 'edit/:id',
        component: FileUploadComponent,
        canActivate: [EditorGuard],
        title: 'Editar Archivo - Plataforma de Conocimiento',
      },
    ],
  },
];
