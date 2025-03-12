import React from 'react';
import { AlertCircle, Code, Info } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SyntaxGuide() {
  return (
    <div className="p-4 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Code className="h-5 w-5" />
        JavaScript Workflow Syntax Guide
      </h2>
      
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Quick Reference</AlertTitle>
        <AlertDescription>
          <div className="text-sm">
            <p>Define your workflow as a modern serverless function:</p>
            <p className="bg-muted p-1 rounded mt-2 font-mono text-xs">export default async (context) =&gt; &#123; /* your workflow code */ &#125;</p>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              <span>Triggers are defined in the UI above, not in your code</span>
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="function">
          <AccordionTrigger>Basic Syntax</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Define your workflow as a serverless function that receives a context parameter:</p>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto mb-2">
{`export default async (context) => {
  // Your workflow code here
  
  // Access trigger data via the context parameter
  const userId = context.user;
  
  // Process the data with async/await
  const result = await ai.classify(context.text);
  
  // Return results if needed
  return result;
}`}
            </pre>
            <p className="text-sm text-muted-foreground">The <code>context</code> parameter contains all data received from your trigger, which is configured in the UI.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="context">
          <AccordionTrigger>Integration Contexts</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">Each integration provides different data in the context object:</p>
            
            <h3 className="font-medium mt-3 mb-1">Slack</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto mb-4">
{`// Slack message context
{
  text: "How do I reset my password?",
  user: "U123456",
  channel: "general",
  timestamp: "1621234567.123456"
}`}
            </pre>
            
            <h3 className="font-medium mt-3 mb-1">LinkedIn</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto mb-4">
{`// LinkedIn resume context
{
  resume: "John Doe\\n+1 (555) 123-4567\\nSenior Software Engineer...",
  source: "CompanyLinkedin"
}`}
            </pre>
            
            <h3 className="font-medium mt-3 mb-1">GitHub</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto mb-4">
{`// GitHub push context
{
  repository: "username/repo",
  event: "push",
  commit: {
    id: "abc123",
    message: "Update README.md",
    author: "User Name <user@example.com>"
  }
}`}
            </pre>
            
            <div className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Options you add in the UI will be available in the context object</span>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="examples">
          <AccordionTrigger>Complete Example</AccordionTrigger>
          <AccordionContent>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto mb-2">
{`export default async (context) => {
  // Slack message handler with AI classification
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
}`}
            </pre>
            <p className="text-sm text-muted-foreground">This example shows a workflow triggered by a Slack message. The trigger is configured in the UI, and the code handles the incoming context.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sdk">
          <AccordionTrigger>Async SDK Functions</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">AI Functions</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><code>await ai.extract()</code> - Extract structured data</li>
                  <li><code>await ai.call()</code> - Make AI phone calls</li>
                  <li><code>await ai.summarize()</code> - Create summaries</li>
                  <li><code>await ai.classify()</code> - Classify content</li>
                  <li><code>await ai.predict_score()</code> - Score predictions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Integration Functions</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><code>await email.send()</code> - Send emails</li>
                  <li><code>await slack.reply()</code> - Reply to Slack messages</li>
                  <li><code>await slack.send_message()</code> - Send Slack messages</li>
                  <li><code>await zendesk.create_ticket()</code> - Create support tickets</li>
                  <li><code>await knowledge_base.query()</code> - Search knowledge base</li>
                  <li><code>await clearbit.enrich_company()</code> - Enrich company data</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">All SDK functions are async and should be called with <code>await</code> to properly handle their results.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="database">
          <AccordionTrigger>Database Operations</AccordionTrigger>
          <AccordionContent>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto mb-2">
{`export default async (context) => {
  // Get stored data
  const counter = await db.get("view_counter") ?? 0;
  
  // Update and store data
  await db.set("view_counter", counter + 1);
  
  // List keys with prefix
  const allKeys = await db.list("user_");
  
  // Delete a key
  await db.delete("old_data");
  
  return { count: counter + 1 };
}`}
            </pre>
            <p className="text-sm text-muted-foreground">Use the built-in <code>db</code> object to persist data between workflow executions.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="best-practices">
          <AccordionTrigger>Best Practices</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>Always use <code>async/await</code> with all SDK functions</li>
              <li>Keep workflows focused on a single business process</li>
              <li>Use meaningful variable names that describe the data</li>
              <li>Add comments to explain complex logic</li>
              <li>Handle potential errors with try/catch blocks:
                <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto my-1">
{`try {
  const result = await api.callMethod();
} catch (error) {
  console.log("Error:", error.message);
}`}
                </pre>
              </li>
              <li>Use modern JS features like optional chaining (?.) and nullish coalescing (??)</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 