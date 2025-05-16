export const environment = {
  production: true,
  apiUrl: '/api', // URL relativa para producción

  // Configuraciones para servicios de autenticación
  auth: {
    tokenKey: 'lab_knowledge_token',
    refreshTokenKey: 'lab_knowledge_refresh_token',
    expiresInKey: 'lab_knowledge_expires_in',
    loginUrl: '/api/auth/login',
    logoutUrl: '/api/auth/logout',
    refreshUrl: '/api/auth/refresh',
  },

  // Configuraciones para carga de archivos
  fileUpload: {
    maxSize: 50 * 1024 * 1024, // 50 MB en bytes para producción
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'video/mp4',
    ],
    uploadUrl: '/api/files/upload',
  },

  // Configuraciones para endpoints de la API
  endpoints: {
    users: '/api/users',
    categories: '/api/categories',
    concepts: '/api/concepts',
    processes: '/api/processes',
    glossary: '/api/glossary',
    calendar: '/api/calendar',
    files: '/api/files',
    clients: '/api/clients',
    zones: '/api/zones',
    tags: '/api/tags',
    comments: '/api/comments',
    search: '/api/search',
  },

  // Configuraciones para la aplicación
  app: {
    pageSize: 20, // Mayor cantidad de elementos por página en producción
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm',
    defaultLanguage: 'es',
    sessionTimeout: 15 * 60 * 1000, // 15 minutos en milisegundos
    debounceTime: 300, // Tiempo de espera para búsquedas reactivas
    analyticsEnabled: true, // Activar analytics en producción
    errorLogEnabled: true, // Registrar errores en producción
    cacheTimeout: 5 * 60 * 1000, // 5 minutos de caché
  },

  // Configuraciones adicionales para producción
  sentry: {
    enabled: true,
    dsn: 'SENTRY_DSN_PLACEHOLDER', // Reemplazar en el despliegue
    environment: 'production',
  },
};
