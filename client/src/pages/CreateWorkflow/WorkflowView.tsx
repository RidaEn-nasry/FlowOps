import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { PlugZap, Play, Code2, Palette, Type, AlertTriangle, CheckCircle, X, HelpCircle, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IntegrationsPanel } from "./components/IntegrationsPanel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { executeWorkflow } from "@/lib/workflow-validator"
import type { ValidationError, LogEntry, TriggerConfig } from "@/lib/workflow-validator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SyntaxGuide } from "./components/SyntaxGuide"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"

interface WorkflowViewProps {
    initialScript: string;
    onUpdate: (script: string) => void;
}

// Mock available integrations that would come from the user's connected accounts
const AVAILABLE_INTEGRATIONS = [
    { id: 'slack', name: 'Slack', events: ['message', 'channel_created', 'member_joined'] },
    { id: 'github', name: 'GitHub', events: ['push', 'pull_request', 'issue_created'] },
    { id: 'salesforce', name: 'Salesforce', events: ['new_lead', 'opportunity_created', 'deal_closed'] },
    { id: 'linkedin', name: 'LinkedIn', events: ['resume', 'profile_viewed', 'connection'] },
    { id: 'notion', name: 'Notion', events: ['page_updated', 'database_updated'] },
    { id: 'zapier', name: 'Zapier', events: ['webhook', 'scheduled'] },
]

// Template definitions
const TEMPLATES = [
    {
        name: "LinkedIn Resume Screening",
        code: `export default async (context) => {
  // Extract key information
  const parsed = await ai.extract({
    prompt: "Extract full name, phone, work experience, summary of resume",
    input: context.resume
  });

  // Conduct automated interview
  const conversationData = await ai.call(
    parsed.phone,
    { script: "perform a screen interview for 15 minutes for junior .net positions" }
  );

  // Generate and send summary
  const summary = await ai.summarize(conversationData);
  await email.send("hr@company.com", summary);
}`
    },
    {
        name: "Slack Support Bot",
        code: `export default async (context) => {
  // Classify the intent of the message
  const intent = await ai.classify(
    context.text, 
    ["question", "complaint", "feedback"]
  );
  
  if (intent === "question") {
    // Find answer in knowledge base
    const answer = await knowledge_base.query(context.text);
    await slack.reply(context.channel, answer);
  } else if (intent === "complaint") {
    // Create support ticket
    const ticket = await zendesk.create_ticket({
      title: context.text,
      priority: "high",
      customer: context.user
    });
    
    await slack.reply(
      context.channel, 
      \`Created support ticket: \${ticket.id}\`
    );
  }
}`
    },
    {
        name: "Data Processor",
        code: `export default async (context) => {
  // Get current view count or default to 0 if not set
  const count = await db.get("view_counter") ?? 0;
  
  // Increment the counter
  await db.set("view_counter", count + 1);
  
  // Return the view count information
  return {
    views: count + 1,
    message: \`This workflow has been executed \${count + 1} times\`
  };
}`
    },
    {
        name: "Sales Lead Processing",
        code: `export default async (context) => {
  // Enrich lead data
  const enriched = await clearbit.enrich_company(context.company);
  
  // Score lead using AI
  const score = await ai.predict_score(enriched, {
    model: "lead_scoring"
  });
  
  // Process high-value leads
  if (score > 0.7) {
    await slack.send_message(
      "sales-team", 
      \`Hot lead: \${context.name} (score: \${score})\`
    );
    
    await email.send_template("sales_intro", {
      to: context.email
    });
  }
}`
    }
]

const EDITOR_THEMES = [
    { name: "Light", value: "vs" },
    { name: "Dark", value: "vs-dark" },
    { name: "High Contrast", value: "hc-black" }
]

const EDITOR_FONTS = [
    { name: "Fira Code", value: "'Fira Code', monospace" },
    { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
    { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
    { name: "Monaco", value: "Monaco, monospace" }
]

// Component for editing custom options
const OptionsEditor = ({ options = {}, onChange }: { 
  options: Record<string, any>; 
  onChange: (options: Record<string, any>) => void;
}) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const addOption = () => {
    if (newKey.trim()) {
      onChange({
        ...options,
        [newKey.trim()]: newValue
      });
      setNewKey('');
      setNewValue('');
    }
  };

  const removeOption = (key: string) => {
    const updatedOptions = { ...options };
    delete updatedOptions[key];
    onChange(updatedOptions);
  };

  return (
    <div className="space-y-3">      
      {/* Display existing options */}
      {Object.keys(options).length > 0 && (
        <div className="space-y-2">
          {Object.entries(options).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between bg-muted rounded-md p-2 text-sm">
              <div>
                <span className="font-mono text-xs">{key}</span>
                <span className="mx-2">:</span>
                <span className="font-mono text-xs">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => removeOption(key)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Add new option */}
      <div className="flex space-x-2">
        <Input
          className="flex-1 h-8 text-xs"
          placeholder="Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <Input
          className="flex-1 h-8 text-xs"
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2" 
          onClick={addOption}
          disabled={!newKey.trim()}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default function WorkflowView({ initialScript, onUpdate }: WorkflowViewProps) {
    const [code, setCode] = useState(initialScript || TEMPLATES[0].code)
    const [theme, setTheme] = useState("vs")
    const [font, setFont] = useState(EDITOR_FONTS[0].value)
    const [validationResult, setValidationResult] = useState<{
        isValid: boolean;
        errors: ValidationError[];
        logs: LogEntry[];
    } | null>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [isResultVisible, setIsResultVisible] = useState(false)
    const [isSyntaxGuideOpen, setIsSyntaxGuideOpen] = useState(false)
    const [triggerConfig, setTriggerConfig] = useState<TriggerConfig>({
        integration: AVAILABLE_INTEGRATIONS[0].id,
        event: AVAILABLE_INTEGRATIONS[0].events[0],
        options: {}
    })
    const [showOptions, setShowOptions] = useState(false)

    useEffect(() => {
        onUpdate(code)
    }, [code, onUpdate])

    const handleCodeChange = (value: string | undefined) => {
        setCode(value || "");
        // Reset validation when code changes
        if (validationResult) {
            setValidationResult(null);
            setIsResultVisible(false);
        }
    }

    const handleTemplateChange = (templateName: string) => {
        const template = TEMPLATES.find(t => t.name === templateName);
        if (template) {
            setCode(template.code);
            // Reset validation when template changes
            setValidationResult(null);
            setIsResultVisible(false);
            
            // Set appropriate trigger based on template
            if (templateName.includes("LinkedIn")) {
                setTriggerConfig({
                    integration: 'linkedin',
                    event: 'resume',
                    options: {}
                });
            } else if (templateName.includes("Slack")) {
                setTriggerConfig({
                    integration: 'slack',
                    event: 'message',
                    options: {}
                });
            } else if (templateName.includes("Sales")) {
                setTriggerConfig({
                    integration: 'salesforce',
                    event: 'new_lead',
                    options: {}
                });
            }
        }
    }

    const handleTestScript = async () => {
        setIsRunning(true);
        setIsResultVisible(true);
        try {
            // Pass the trigger configuration to the execution environment
            const result = await executeWorkflow(code, triggerConfig);
            setValidationResult(result);
        } catch (error) {
            console.error('Error testing script:', error);
            setValidationResult({
                isValid: false,
                errors: [{
                    line: 0,
                    message: 'Unexpected error during testing',
                    type: 'runtime'
                }],
                logs: [{
                    type: 'error',
                    message: 'Test execution failed',
                    timestamp: Date.now()
                }]
            });
        } finally {
            setIsRunning(false);
        }
    }

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    }

    // Find current integration
    const currentIntegration = AVAILABLE_INTEGRATIONS.find(i => i.id === triggerConfig.integration);
    
    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center justify-between px-4 h-14 border-b bg-background">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <PlugZap className="w-5 h-5" />
                        <h1 className="font-medium">New Workflow</h1>
                    </div>

                    <div className="h-6 w-px bg-border" />

                    <Select onValueChange={(template) => handleTemplateChange(template)}>
                        <SelectTrigger className="w-[240px]">
                            <Code2 className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                            {TEMPLATES.map((template) => (
                                <SelectItem key={template.name} value={template.name}>
                                    {template.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-[140px]">
                            <Palette className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            {EDITOR_THEMES.map((theme) => (
                                <SelectItem key={theme.value} value={theme.value}>
                                    {theme.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={font} onValueChange={setFont}>
                        <SelectTrigger className="w-[180px]">
                            <Type className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Font" />
                        </SelectTrigger>
                        <SelectContent>
                            {EDITOR_FONTS.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                    {font.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setIsSyntaxGuideOpen(true)}
                                    className="h-8 w-8"
                                >
                                    <HelpCircle className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View syntax guide</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleTestScript}
                        disabled={isRunning}
                    >
                        <Play className="w-4 h-4 mr-2" />
                        {isRunning ? 'Testing...' : 'Test'}
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className={`flex-1 ${isResultVisible ? 'w-[60%]' : ''}`}>
                    <div className="h-full flex flex-col">
                        {/* Trigger Configuration UI - Simplified and Minimal */}
                        <div className="p-4 border-b">
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <span>Trigger</span> 
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col space-y-4">
                                        {/* Integration selection */}
                                        <div className="flex items-center gap-4">
                                            <Select 
                                                value={triggerConfig.integration}
                                                onValueChange={(value) => {
                                                    const integration = AVAILABLE_INTEGRATIONS.find(i => i.id === value);
                                                    setTriggerConfig({
                                                        integration: value,
                                                        event: integration?.events[0] || '',
                                                        options: {}
                                                    });
                                                }}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select integration" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {AVAILABLE_INTEGRATIONS.map(integration => (
                                                        <SelectItem key={integration.id} value={integration.id}>
                                                            {integration.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {/* Event selection */}
                                            {currentIntegration && (
                                                <Select 
                                                    value={triggerConfig.event}
                                                    onValueChange={(value) => setTriggerConfig({
                                                        ...triggerConfig,
                                                        event: value
                                                    })}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select event" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currentIntegration.events.map(event => (
                                                            <SelectItem key={event} value={event}>
                                                                {event.replace(/_/g, ' ')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}

                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setShowOptions(!showOptions)}
                                                className="ml-auto"
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Options
                                            </Button>
                                        </div>

                                        {/* Options UI */}
                                        {showOptions && (
                                            <OptionsEditor 
                                                options={triggerConfig.options || {}}
                                                onChange={(newOptions) => setTriggerConfig({
                                                    ...triggerConfig,
                                                    options: newOptions
                                                })}
                                            />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Code Editor */}
                        <div className="flex-1">
                            <Editor
                                height="100%"
                                defaultLanguage="javascript"
                                language="javascript"
                                theme={theme}
                                value={code}
                                onChange={(value) => handleCodeChange(value)}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    fontFamily: font,
                                    lineNumbers: "on",
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 16, bottom: 16 },
                                    smoothScrolling: true,
                                    cursorBlinking: "smooth",
                                    cursorSmoothCaretAnimation: "explicit",
                                    formatOnPaste: true,
                                    formatOnType: true,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {isResultVisible && (
                    <div className="border-l w-[40%] flex flex-col h-full">
                        <div className="flex items-center justify-between px-4 py-2 border-b">
                            <div className="flex items-center gap-2">
                                {validationResult?.isValid ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                )}
                                <h3 className="font-medium text-sm">Test Results</h3>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => setIsResultVisible(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <Tabs defaultValue="logs" className="flex-1 flex flex-col">
                            <TabsList className="mx-4 my-2">
                                <TabsTrigger value="logs">Logs</TabsTrigger>
                                <TabsTrigger value="errors">
                                    Errors
                                    {validationResult?.errors.length ? 
                                        <Badge variant="destructive" className="ml-2">
                                            {validationResult.errors.length}
                                        </Badge> : null
                                    }
                                </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="logs" className="flex-1 p-0 m-0">
                                <ScrollArea className="h-full p-4">
                                    {validationResult?.logs.map((log, index) => (
                                        <div key={index} className="mb-2 text-sm">
                                            <span className="text-muted-foreground text-xs mr-2">
                                                {formatTimestamp(log.timestamp)}
                                            </span>
                                            <span className={`${
                                                log.type === 'error' ? 'text-destructive' : 
                                                log.type === 'warning' ? 'text-amber-500' : 
                                                log.type === 'result' ? 'text-green-500' : ''
                                            }`}>
                                                {log.message}
                                            </span>
                                        </div>
                                    ))}
                                    {!validationResult?.logs.length && (
                                        <div className="text-center text-muted-foreground p-4">
                                            No logs available
                                        </div>
                                    )}
                                </ScrollArea>
                            </TabsContent>
                            
                            <TabsContent value="errors" className="flex-1 p-0 m-0">
                                <ScrollArea className="h-full">
                                    {validationResult?.errors.length ? (
                                        <div className="space-y-2 p-4">
                                            {validationResult.errors.map((error, index) => (
                                                <Alert key={index} variant={error.type === 'warning' ? 'default' : 'destructive'}>
                                                    <AlertTitle className="flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        {error.type === 'syntax' ? 'Syntax Error' : 
                                                         error.type === 'runtime' ? 'Runtime Error' : 'Warning'}
                                                        {error.line > 0 && (
                                                            <Badge variant="outline" className="ml-2">Line {error.line}</Badge>
                                                        )}
                                                    </AlertTitle>
                                                    <AlertDescription>
                                                        {error.message}
                                                    </AlertDescription>
                                                </Alert>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted-foreground p-4">
                                            {isRunning ? 'Running tests...' : 'No errors found'}
                                        </div>
                                    )}
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                <IntegrationsPanel />
            </div>

            <Dialog open={isSyntaxGuideOpen} onOpenChange={setIsSyntaxGuideOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Workflow Syntax Guide</DialogTitle>
                    </DialogHeader>
                    <SyntaxGuide />
                </DialogContent>
            </Dialog>
        </div>
    )
} 