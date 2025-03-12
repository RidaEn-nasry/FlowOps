export interface AppConfig {
  app: {
    name: string;
    version: string;
    host: string;
    port: number;
    debug: boolean;
  };
  mongodb: {
    uri: string;
  };
  prisma: {
    workflow_db_url: string;
    memory_db_url: string;
  };
  rabbitmq: {
    uri: string;
    exchange: string;
    queues: {
      workflow: string;
      memory: string;
    };
  };
  services: {
    workflow: {
      url: string;
    };
    memory: {
      url: string;
    };
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
    debug: process.env.DEBUG === 'true' || false,
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/flowops',
  },
  prisma: {
    workflow_db_url: process.env.WORKFLOW_DATABASE_URL || 'mongodb://localhost:27017/workflow',
    memory_db_url: process.env.MEMORY_DATABASE_URL || 'mongodb://localhost:27017/memory',
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI || 'amqp://localhost:5672',
    exchange: process.env.RABBITMQ_EXCHANGE || 'flowops',
    queues: {
      workflow: process.env.RABBITMQ_QUEUE_WORKFLOW || 'workflows',
      memory: process.env.RABBITMQ_QUEUE_MEMORY || 'memory',
    },
  },
  services: {
    workflow: {
      url: process.env.SERVICES_WORKFLOW_URL || 'http://localhost:3001',
    },
    memory: {
      url: process.env.SERVICES_MEMORY_URL || 'http://localhost:3002',
    },
  },
  cors: {
    origins: process.env.ALLOW_ORIGINS ? process.env.ALLOW_ORIGINS.split(',') : ['*'],
    credentials: process.env.ALLOW_CREDENTIALS === 'true' || false,
    methods: process.env.ALLOW_METHODS ? process.env.ALLOW_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE'],
    headers: process.env.ALLOW_HEADERS ? process.env.ALLOW_HEADERS.split(',') : ['Content-Type', 'Authorization'],
  },
}); 