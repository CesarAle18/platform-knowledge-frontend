export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',

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
    maxSize: 100 * 1024 * 1024, // 100 MB en bytes
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
    pageSize: 10,
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm',
    defaultLanguage: 'es',
    sessionTimeout: 30 * 60 * 1000, // 30 minutos en milisegundos
    debounceTime: 300, // Tiempo de espera para búsquedas reactivas
  },
};
