export interface AppConfig {
  app: {
    name: string;
    version: string;
    host: string;
    port: number;
    environment: string;
  };
  mongodb: {
    uri: string;
  };
  database: {
    url: string;
  };
  frontend: {
    url: string;
  };
  cors: {
    origins: string[];
    credentials: boolean;
    methods: string[];
    headers: string[];
  };
}

export default (): AppConfig => ({
  app: {
    name: process.env.APP_NAME || 'flowops-api',
    version: process.env.APP_VERSION || '1.0.0',
    host: process.env.APP_HOST || '0.0.0.0',
    port: parseInt(process.env.APP_PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/flowops',
  },
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/flowops',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3001',
  },
  cors: {
    origins: process.env.ALLOW_ORIGINS ? process.env.ALLOW_ORIGINS.split(',') : ['*'],
    credentials: process.env.ALLOW_CREDENTIALS === 'true' || false,
    methods: process.env.ALLOW_METHODS ? process.env.ALLOW_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE'],
    headers: process.env.ALLOW_HEADERS ? process.env.ALLOW_HEADERS.split(',') : ['Content-Type', 'Authorization'],
  },
}); 