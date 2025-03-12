// SDK stubs for workflow testing in browser
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  logs: LogEntry[];
}

interface ValidationError {
  line: number;
  message: string;
  type: 'syntax' | 'runtime' | 'warning';
}

interface LogEntry {
  type: 'info' | 'warning' | 'error' | 'result';
  message: string;
  timestamp: number;
}

interface TriggerInfo {
  integration: string | null;
  event: string | null;
  contextParam: string | null;
  language: 'js';
}

interface TriggerConfig {
  integration: string;
  event: string;
  options?: Record<string, any>;
}

// Mock SDK functions that will be available in the workflow scripts
const sdkStubs = {
  ai: {
    extract: async (args: any) => {
      console.log('[SDK] AI Extract called with:', args);
      return {
        'full_name': 'John Doe',
        'phone': '+1 (555) 123-4567',
        'work_experience': '5 years at ABC Corp',
        'summary': 'Experienced software developer with focus on backend systems'
      };
    },
    call: async (phone: string, options: any) => {
      console.log('[SDK] AI Call initiated to:', phone, 'with options:', options);
      return "Mock conversation data";
    },
    summarize: async (text: string) => {
      console.log('[SDK] AI Summarize called with text length:', text?.length || 0);
      return "Candidate has relevant experience and skills for the position.";
    },
    classify: async (text: string, categories: string[]) => {
      console.log('[SDK] AI Classify called with:', { text, categories });
      return categories[0]; // Return first category for testing
    },
    predict_score: async (data: any, options: any) => {
      console.log('[SDK] AI Predict Score called with:', { data, options });
      return 0.85; // High score for testing
    }
  },
  
  // Database operations (similar to the blob in the example)
  db: {
    get: async (key: string) => {
      console.log('[SDK] DB Get:', key);
      // Mock database with some predefined values
      const mockData: Record<string, any> = {
        'visit_counter': 42,
        'user_preferences': { theme: 'dark', notifications: true },
        'recent_items': ['item1', 'item2', 'item3']
      };
      return mockData[key] || null;
    },
    set: async (key: string, value: any) => {
      console.log('[SDK] DB Set:', key, 'to value:', value);
      return true;
    },
    delete: async (key: string) => {
      console.log('[SDK] DB Delete:', key);
      return true;
    },
    list: async (prefix: string) => {
      console.log('[SDK] DB List with prefix:', prefix);
      return ['visit_counter', 'user_preferences', 'recent_items'].filter(key => 
        key.startsWith(prefix || '')
      );
    }
  },
  
  email: {
    send: async (to: string, body: string) => {
      console.log('[SDK] Email sent to:', to, 'with body:', body);
      return { success: true, messageId: 'mock-message-id-123' };
    },
    send_template: async (template: string, options: any) => {
      console.log('[SDK] Email template sent:', template, 'with options:', options);
      return { success: true, messageId: 'mock-template-id-123' };
    }
  },

  slack: {
    reply: async (channel: string, message: string) => {
      console.log('[SDK] Slack reply to channel:', channel, 'with message:', message);
      return { ts: 'timestamp-123', channel };
    },
    send_message: async (channel: string, message: string) => {
      console.log('[SDK] Slack message sent to channel:', channel, 'with message:', message);
      return { ts: 'timestamp-123', channel };
    }
  },

  zendesk: {
    create_ticket: async (options: any) => {
      console.log('[SDK] Zendesk ticket created with options:', options);
      return { id: 'ticket-123', status: 'new' };
    }
  },

  knowledge_base: {
    query: async (query: string) => {
      console.log('[SDK] Knowledge base queried with:', query);
      return "Here is the information you requested from the knowledge base.";
    }
  },

  clearbit: {
    enrich_company: async (company: string) => {
      console.log('[SDK] Clearbit company enrichment for:', company);
      return {
        name: company,
        domain: `${company.toLowerCase().replace(/\s+/g, '')}.com`,
        category: { industry: 'Technology' },
        metrics: { employees: 250, annualRevenue: 5000000 }
      };
    }
  }
};

// Function to extract trigger information from the script
function extractTriggerInfo(script: string): TriggerInfo | null {
  // Look for export default async function pattern (modern serverless style)
  const exportDefaultRegex = /^\s*export\s+default\s+async\s*\(\s*(\w+)\s*\)\s*=>/;
  const exportDefaultMatch = script.match(exportDefaultRegex);
  
  if (exportDefaultMatch) {
    // For the modern syntax, we'll return a default trigger info
    return {
      integration: null,
      event: null,
      contextParam: exportDefaultMatch[1] || null, // This captures the parameter name (e.g., "context")
      language: 'js'
    };
  }
  
  // Legacy async function pattern
  const asyncFunctionRegex = /^\s*async\s*\(\s*(\w+)\s*\)\s*=>/;
  const asyncMatch = script.match(asyncFunctionRegex);
  
  if (asyncMatch) {
    return {
      integration: null,
      event: null,
      contextParam: asyncMatch[1] || null,
      language: 'js'
    };
  }
  
  // Modern trigger function pattern (legacy support)
  const modernTriggerRegex = /trigger\s*\(\s*{\s*integration\s*:\s*['"]([^'"]+)['"]\s*,\s*event\s*:\s*['"]([^'"]+)['"]\s*(?:,\s*(?:channel|source)\s*:\s*['"]([^'"]+)['"]\s*)?(?:,\s*[^}]*)?}\s*\)\s*\(\s*async\s*\(\s*\w+\s*\)\s*=>/;
  const modernMatch = script.match(modernTriggerRegex);
  
  if (modernMatch) {
    return {
      integration: modernMatch[1] || null,
      event: modernMatch[2] || null,
      contextParam: modernMatch[3] || null,
      language: 'js'
    };
  }

  // Legacy flowops.trigger pattern
  const legacyTriggerRegex = /flowops\.trigger\s*\(\s*{\s*integration\s*:\s*['"]([^'"]+)['"]\s*,\s*event\s*:\s*['"]([^'"]+)['"]\s*(?:,\s*(?:channel|source)\s*:\s*['"]([^'"]+)['"]\s*)?(?:,\s*[^}]*)?}\s*\)/;
  const legacyMatch = script.match(legacyTriggerRegex);
  
  if (legacyMatch) {
    return {
      integration: legacyMatch[1] || null,
      event: legacyMatch[2] || null,
      contextParam: legacyMatch[3] || null,
      language: 'js'
    };
  }

  return null;
}

// Function to validate the script syntax
function validateSyntax(script: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Check for modern syntax (export default async or just async)
  if (!script.match(/^\s*export\s+default\s+async\s*\(\s*\w+\s*\)\s*=>/) && 
      !script.match(/^\s*async\s*\(\s*\w+\s*\)\s*=>/)) {
    // If no valid function declaration found, check for legacy trigger patterns
    const triggerInfo = extractTriggerInfo(script);
    if (!triggerInfo) {
      errors.push({
        line: 1, 
        message: 'Invalid workflow syntax. Use the pattern: export default async (context) => {...}',
        type: 'syntax'
      });
    }
  }
  
  // Check for balanced parentheses, brackets, etc.
  const brackets = [];
  const lines = script.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '(' || char === '[' || char === '{') {
        brackets.push({ char, line: i + 1 });
      } else if (char === ')' || char === ']' || char === '}') {
        const matching = {
          ')': '(',
          ']': '[',
          '}': '{'
        }[char];
        
        if (brackets.length === 0 || brackets[brackets.length - 1].char !== matching) {
          errors.push({
            line: i + 1,
            message: `Unmatched closing bracket: ${char}`,
            type: 'syntax'
          });
        } else {
          brackets.pop();
        }
      }
    }
  }
  
  // Check for any remaining open brackets
  brackets.forEach(bracket => {
    errors.push({
      line: bracket.line,
      message: `Unclosed bracket: ${bracket.char}`,
      type: 'syntax'
    });
  });
  
  return errors;
}

// Convert a JavaScript function to its string representation
function functionToString(func: Function): string {
  return func.toString();
}

// Execute the workflow script with mock data
async function executeWorkflow(script: string, triggerConfig?: TriggerConfig): Promise<ValidationResult> {
  const logs: LogEntry[] = [];
  const errors: ValidationError[] = [];
  
  // Syntax validation
  const syntaxErrors = validateSyntax(script);
  errors.push(...syntaxErrors);
  
  if (syntaxErrors.length > 0) {
    return { 
      isValid: false, 
      errors, 
      logs: [
        {
          type: 'error',
          message: 'Syntax validation failed',
          timestamp: Date.now()
        }
      ] 
    };
  }
  
  try {
    logs.push({
      type: 'info',
      message: 'Starting workflow execution',
      timestamp: Date.now()
    });
    
    // Use UI-defined trigger configuration if provided
    let effectiveTriggerInfo: TriggerInfo;
    
    if (triggerConfig) {
      // Log the UI-defined trigger configuration
      logs.push({
        type: 'info',
        message: `Using UI-defined trigger: ${triggerConfig.integration}/${triggerConfig.event}`,
        timestamp: Date.now()
      });
      
      // Map the UI trigger config to our internal TriggerInfo format
      effectiveTriggerInfo = {
        integration: triggerConfig.integration,
        event: triggerConfig.event,
        contextParam: null,
        language: 'js'
      };
    } else {
      // Fall back to extracting trigger from code if UI config not provided (legacy support)
      const extractedTriggerInfo = extractTriggerInfo(script);
      
      // Create a default trigger info if using the new simplified syntax
      effectiveTriggerInfo = extractedTriggerInfo || {
        integration: 'default',
        event: 'default',
        contextParam: null,
        language: 'js'
      };
      
      logs.push({
        type: 'info',
        message: effectiveTriggerInfo.integration && effectiveTriggerInfo.event 
          ? `Trigger detected from code: ${effectiveTriggerInfo.integration}/${effectiveTriggerInfo.event}`
          : 'Using default trigger configuration',
        timestamp: Date.now()
      });
    }
    
    // Create a mock context based on the trigger type
    let mockContext: any;
    
    switch (effectiveTriggerInfo.integration) {
      case 'http':
        mockContext = {
          method: (triggerConfig?.options?.httpMethod || 'GET').toUpperCase(),
          url: `https://example.com${triggerConfig?.options?.httpPath || '/api/hello'}`,
          headers: {
            'content-type': 'application/json',
            'user-agent': 'Mozilla/5.0',
            'x-request-id': 'req_' + Math.random().toString(36).substring(2, 15)
          },
          body: { data: "Sample request data" }
        };
        break;
      case 'slack':
        mockContext = { 
          text: "How do I reset my password?", 
          user: "U123456", 
          channel: triggerConfig?.options?.channel || "general" 
        };
        break;
      case 'linkedin':
        mockContext = { 
          resume: "John Doe\n+1 (555) 123-4567\nSenior Software Engineer at ABC Corp\n5 years experience in React and Node.js",
          source: triggerConfig?.options?.source || "CompanyLinkedin"
        };
        break;
      case 'salesforce':
        mockContext = { 
          name: "Acme Inc", 
          email: "contact@acme.com", 
          company: "Acme", 
          leadSource: "Website" 
        };
        break;
      case 'github':
        mockContext = {
          repository: triggerConfig?.options?.repository || "username/repo",
          event: effectiveTriggerInfo.event,
          commit: {
            id: "abc123",
            message: "Update README.md",
            author: "User Name <user@example.com>"
          }
        };
        break;
      case 'notion':
        mockContext = {
          pageId: "abc123",
          pageTitle: "Meeting Notes",
          lastEditedBy: "User Name",
          content: "Content of the page that was updated"
        };
        break;
      default:
        // For UI-defined triggers, provide a richer mock context
        mockContext = { 
          // Generic context with various data types
          text: "Sample message content",
          user: "user123",
          channel: "general",
          email: "user@example.com",
          name: "Sample User",
          company: "Sample Corp",
          phone: "+1 (555) 987-6543",
          data: {
            id: "data123",
            type: "sample",
            attributes: {
              field1: "value1",
              field2: "value2"
            }
          },
          timestamp: new Date().toISOString(),
          resume: "John Doe\n+1 (555) 123-4567\nSenior Software Engineer\n5 years experience"
        };
    }
    
    logs.push({
      type: 'info',
      message: `Using mock context: ${JSON.stringify(mockContext)}`,
      timestamp: Date.now()
    });
    
    // Create a sandbox to execute the script
    const originalConsoleLog = console.log;
    
    // Override console.log to capture logs
    console.log = (...args) => {
      logs.push({
        type: 'info',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '),
        timestamp: Date.now()
      });
      originalConsoleLog(...args);
    };
    
    // Execute the script in a controlled environment
    try {
      // Set up SDK stubs with async support
      const sdkSetup = `
        // SDK stubs with async support
        
        // Web API stubs for Response and fetch
        class Response {
          constructor(body, options = {}) {
            this.body = body;
            this.status = options.status || 200;
            this.statusText = options.statusText || '';
            this.headers = options.headers || {};
            console.log('[SDK] Created Response:', { status: this.status, headers: this.headers });
          }
          
          async text() {
            return String(this.body);
          }
          
          async json() {
            return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
          }
        }
        
        const fetch = async (url, options = {}) => {
          console.log('[SDK] Fetch request to:', url, 'with options:', options);
          // Mock response based on URL
          if (url.includes('example.com')) {
            return new Response(JSON.stringify({ success: true, data: { id: '123', name: 'Example' }}));
          } else if (url.includes('error')) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
          }
          return new Response(JSON.stringify({ mock: 'data' }));
        };
        
        // Mock renderToString for JSX
        const renderToString = (jsxElement) => {
          // This is a very basic mock - in reality this would render JSX to HTML
          console.log('[SDK] Rendering JSX element');
          if (typeof jsxElement === 'object') {
            return '<div>Mocked JSX rendering</div>';
          }
          return String(jsxElement);
        };
        
        // Create SDK stubs based on selected integration
        const triggerIntegration = ${JSON.stringify(triggerConfig?.integration || 'default')};
        const triggerEvent = ${JSON.stringify(triggerConfig?.event || 'default')};
        
        console.log(\`[SDK] Loading integration: \${triggerIntegration}/\${triggerEvent}\`);
        
        // AI functions are always available
        const ai = {
          extract: async (args) => {
            console.log('[SDK] AI Extract called with:', args);
            return {
              'full_name': 'John Doe',
              'phone': '+1 (555) 123-4567',
              'work_experience': '5 years at ABC Corp',
              'summary': 'Experienced software developer with focus on backend systems'
            };
          },
          call: async (phone, options) => {
            console.log('[SDK] AI Call initiated to:', phone, 'with options:', options);
            return "Mock conversation data";
          },
          summarize: async (text) => {
            console.log('[SDK] AI Summarize called with text length:', text?.length || 0);
            return "Candidate has relevant experience and skills for the position.";
          },
          classify: async (text, categories) => {
            console.log('[SDK] AI Classify called with:', { text, categories });
            return categories[0]; // Return first category for testing
          },
          predict_score: async (data, options) => {
            console.log('[SDK] AI Predict Score called with:', { data, options });
            return 0.85; // High score for testing
          }
        };
        
        // Database operations - always available
        const db = {
          get: async (key) => {
            console.log('[SDK] DB Get:', key);
            // Mock database with some predefined values
            const mockData = {
              'visit_counter': 42,
              'user_preferences': { theme: 'dark', notifications: true },
              'recent_items': ['item1', 'item2', 'item3']
            };
            return mockData[key] || null;
          },
          set: async (key, value) => {
            console.log('[SDK] DB Set:', key, 'to value:', value);
            return true;
          },
          delete: async (key) => {
            console.log('[SDK] DB Delete:', key);
            return true;
          },
          list: async (prefix) => {
            console.log('[SDK] DB List with prefix:', prefix);
            return ['visit_counter', 'user_preferences', 'recent_items'].filter(key => 
              key.startsWith(prefix || '')
            );
          }
        };
        
        // Email functions
        const email = {
          send: async (to, body) => {
            console.log('[SDK] Email sent to:', to, 'with body:', body);
            return { success: true, messageId: 'mock-message-id-123' };
          },
          send_template: async (template, options) => {
            console.log('[SDK] Email template sent:', template, 'with options:', options);
            return { success: true, messageId: 'mock-template-id-123' };
          }
        };
        
        // Slack functions, especially relevant for slack integration
        const slack = {
          reply: async (channel, message) => {
            console.log('[SDK] Slack reply to channel:', channel, 'with message:', message);
            return { ts: 'timestamp-123', channel };
          },
          send_message: async (channel, message) => {
            console.log('[SDK] Slack message sent to channel:', channel, 'with message:', message);
            return { ts: 'timestamp-123', channel };
          }
        };
        
        // Zendesk functions
        const zendesk = {
          create_ticket: async (options) => {
            console.log('[SDK] Zendesk ticket created with options:', options);
            return { id: 'ticket-123', status: 'new' };
          }
        };
        
        // Knowledge base functions
        const knowledge_base = {
          query: async (query) => {
            console.log('[SDK] Knowledge base queried with:', query);
            return "Here is the information you requested from the knowledge base.";
          }
        };
        
        // Clearbit functions
        const clearbit = {
          enrich_company: async (company) => {
            console.log('[SDK] Clearbit company enrichment for:', company);
            return {
              name: company,
              domain: company.toLowerCase().replace(/\\s+/g, '') + '.com',
              category: { industry: 'Technology' },
              metrics: { employees: 250, annualRevenue: 5000000 }
            };
          }
        };
        
        // GitHub specific functions
        const github = triggerIntegration === 'github' ? {
          create_pr: async (options) => {
            console.log('[SDK] GitHub PR created:', options);
            return { id: 'pr-123', url: 'https://github.com/user/repo/pull/123' };
          },
          comment: async (issue, comment) => {
            console.log('[SDK] GitHub comment added to issue/PR:', { issue, comment });
            return { id: 'comment-123' };
          }
        } : null;
        
        // LinkedIn specific functions
        const linkedin = triggerIntegration === 'linkedin' ? {
          analyze_profile: async (profile) => {
            console.log('[SDK] LinkedIn profile analyzed:', profile);
            return { skills: ['JavaScript', 'React', 'Node.js'], experience: '5 years' };
          }
        } : null;
        
        // Salesforce specific functions
        const salesforce = triggerIntegration === 'salesforce' ? {
          update_lead: async (lead, data) => {
            console.log('[SDK] Salesforce lead updated:', { lead, data });
            return { success: true, id: 'lead-123' };
          },
          create_opportunity: async (data) => {
            console.log('[SDK] Salesforce opportunity created:', data);
            return { success: true, id: 'opp-123' };
          }
        } : null;
        
        // For UI-defined triggers, we don't need this legacy code but keeping for backwards compatibility
        const trigger = (config) => {
          return (handler) => {
            // Just return the handler for execution
            return handler;
          };
        };
      `;
      
      // Create script wrapper for async execution
      const scriptWithWrapper = `
        ${sdkSetup}
        
        // Execute the workflow handler function with mock context
        async function runWorkflow() {
          try {
            // Handle different syntax patterns
            const isExportDefault = /^\\s*export\\s+default\\s+async\\s*\\(\\s*\\w+\\s*\\)\\s*=>/.test(script);
            const isSimplified = /^\\s*async\\s*\\(\\s*\\w+\\s*\\)\\s*=>/.test(script);
            
            if (isExportDefault) {
              // Modern serverless pattern (export default async)
              // Extract the handler function
              const handlerMatch = /export\\s+default\\s+(async\\s*\\(\\s*\\w+\\s*\\)\\s*=>\\s*{[\\s\\S]*})/.exec(script);
              if (!handlerMatch) {
                return { success: false, error: "Could not extract handler function" };
              }
              
              const handlerBody = handlerMatch[1];
              const handlerFn = eval('(' + handlerBody + ')');
              const result = await handlerFn(${JSON.stringify(mockContext)});
              return { success: true, result };
            } else if (isSimplified) {
              // Previous simplified syntax (just async)
              const handler = eval('(' + script + ')');
              const result = await handler(${JSON.stringify(mockContext)});
              return { success: true, result };
            } else {
              // Legacy trigger syntax
              // Extract the handler function from trigger pattern
              const handlerMatch = /trigger\\s*\\(.*?\\)\\s*\\(\\s*(async\\s*\\(\\s*\\w+\\s*\\)\\s*=>\\s*{[\\s\\S]*?})\\s*\\)\\s*;?/.exec(script);
              if (!handlerMatch) {
                return { success: false, error: "Could not extract handler function" };
              }
              
              // Construct and evaluate the handler function
              const handlerBody = handlerMatch[1];
              const handlerFn = eval('(' + handlerBody + ')');
              
              // Execute the handler with mock context
              const result = await handlerFn(${JSON.stringify(mockContext)});
              return { success: true, result };
            }
          } catch (error) {
            return { success: false, error: error.message };
          }
        }
        
        // Run the workflow and return result
        return await runWorkflow();
      `;
      
      // This approach is just for demonstration - in a real implementation,
      // you'd want to use a more secure solution like a WebWorker or iframe sandbox
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const result = await new AsyncFunction(scriptWithWrapper)();
      
      logs.push({
        type: 'result',
        message: `Execution result: ${JSON.stringify(result)}`,
        timestamp: Date.now()
      });
      
      if (!result.success) {
        errors.push({
          line: 0, // We don't know the exact line number from this error
          message: `Runtime error: ${result.error}`,
          type: 'runtime'
        });
      }
    } catch (error: any) {
      errors.push({
        line: 0,
        message: `Runtime error: ${error.message}`,
        type: 'runtime'
      });
      
      logs.push({
        type: 'error',
        message: `Execution failed: ${error.message}`,
        timestamp: Date.now()
      });
    } finally {
      // Restore the original console.log
      console.log = originalConsoleLog;
    }
    
  } catch (error: any) {
    errors.push({
      line: 0,
      message: `Unexpected error: ${error.message}`,
      type: 'runtime'
    });
    
    logs.push({
      type: 'error',
      message: `Validation failed: ${error.message}`,
      timestamp: Date.now()
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    logs
  };
}

export { executeWorkflow };
export type { ValidationResult, ValidationError, LogEntry, TriggerConfig }; 