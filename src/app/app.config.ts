import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PrimeNGConfig } from 'primeng/api';

// Rutas
import { routes } from './app.routes'; // Asegúrate de que este archivo contenga las rutas combinadas de APP_ROUTES y routes

// Interceptores
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración del enrutador con transiciones de vista
    provideRouter(routes, withViewTransitions()),

    // Configuración del cliente HTTP con interceptores
    provideHttpClient(withInterceptors([authInterceptor])),

    // Soporte para animaciones (requerido por PrimeNG y otras animaciones de Angular)
    provideAnimations(),

    // Configuración de PrimeNG
    {
      provide: PrimeNGConfig,
      useFactory: () => {
        const config = new PrimeNGConfig();

        // Configuraciones globales de PrimeNG
        config.ripple = true; // Habilitar efecto ripple

        // Traducción de componentes PrimeNG al español
        config.setTranslation({
          accept: 'Aceptar',
          reject: 'Rechazar',
          choose: 'Elegir',
          upload: 'Cargar',
          cancel: 'Cancelar',
          dayNames: [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
          ],
          dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
          monthNames: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
          ],
          monthNamesShort: [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
          ],
          today: 'Hoy',
          clear: 'Limpiar',
          weekHeader: 'Sem',
        });

        return config;
      },
    },

    // Importar proveedores adicionales (si necesitas módulos legacy o específicos)
    importProvidersFrom([
      // Aquí puedes agregar módulos que requieran proveedores, si es necesario
    ]),
  ],
};
