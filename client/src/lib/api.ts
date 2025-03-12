import axios from 'axios';

// Get API URL from environment variables, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SelectOption {
  id?: string;
  label: string;
  color?: string;
}

export interface Column {
  id?: string;
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  options?: SelectOption[];
}

export interface DatabaseDefinition {
  id?: string;
  name: string;
  workflowId: string;
  columns: Column[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Workflow {
  id?: string;
  name: string;
  script: string;
  databaseColumns?: Column[];
  createdAt?: string;
  updatedAt?: string;
  // Additional properties for UI display
  status?: 'active' | 'inactive';
  dotColor?: string;
  activityData?: number[];
  cost?: string;
}

// Workflow API
export const workflowApi = {
  // Create a new workflow
  createWorkflow: async (workflow: Workflow): Promise<Workflow> => {
    const response = await api.post('/api/v1/workflows', workflow);
    return response.data;
  },

  // Get a workflow by ID
  getWorkflow: async (id: string): Promise<Workflow> => {
    const response = await api.get(`/api/v1/workflows/${id}`);
    return response.data;
  },

  // Get all workflows
  getAllWorkflows: async (): Promise<Workflow[]> => {
    const response = await api.get('/api/v1/workflows');
    return response.data;
  },

  // Update a workflow
  updateWorkflow: async (id: string, workflow: Workflow): Promise<Workflow> => {
    const response = await api.put(`/api/v1/workflows/${id}`, workflow);
    return response.data;
  },

  // Delete a workflow
  deleteWorkflow: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/workflows/${id}`);
  },
};

// Memory API (for database definitions)
export const memoryApi = {
  // Create a new database definition
  createDatabaseDefinition: async (databaseDefinition: DatabaseDefinition): Promise<DatabaseDefinition> => {
    const response = await api.post('/api/v1/memory/databases', databaseDefinition);
    return response.data;
  },

  // Get a database definition by ID
  getDatabaseDefinition: async (id: string): Promise<DatabaseDefinition> => {
    const response = await api.get(`/api/v1/memory/databases/${id}`);
    return response.data;
  },

  // Get database definitions by workflow ID
  getDatabaseDefinitionsByWorkflowId: async (workflowId: string): Promise<DatabaseDefinition[]> => {
    const response = await api.get(`/api/v1/memory/workflows/${workflowId}/databases`);
    return response.data;
  },
};

export default api; 