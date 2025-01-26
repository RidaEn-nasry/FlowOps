import { useState } from "react"
import Editor from "@monaco-editor/react"
import { PlugZap, Play, Code2, Palette, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IntegrationsPanel } from "./components/IntegrationsPanel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TEMPLATES = [
    {
        name: "LinkedIn Resume Screening",
        code: `@trigger(integration="linkedin", event="resume", source="Billo")
def w(resume):
    parsed = ai.extract(
       prompt="Extract full name, phone, work experience, summary of resume",
       input=resume
    )
    conversation_data = ai.call(parsed["phone"], script="perform a screen interview for 15 minutes for junior .net positions")
    summary = ai.summarize(conversation_data)
    email.send("hr@company.com", summary)`
    },
    {
        name: "Slack Support Bot",
        code: `@trigger(integration="slack", event="message", channel="support")
def w(message):
    intent = ai.classify(message.text, ["question", "complaint", "feedback"])
    
    if intent == "question":
        answer = knowledge_base.query(message.text)
        slack.reply(message.channel, answer)
    elif intent == "complaint":
        ticket = zendesk.create_ticket(
            title=message.text,
            priority="high",
            customer=message.user
        )
        slack.reply(message.channel, f"Created support ticket: {ticket.id}")`,
    },
    {
        name: "Sales Lead Processing",
        code: `@trigger(integration="salesforce", event="new_lead")
def w(lead):
    enriched = clearbit.enrich_company(lead.company)
    score = ai.predict_score(enriched, model="lead_scoring")
    
    if score > 0.7:
        slack.send_message("sales-team", f"Hot lead: {lead.name} ({score})")
        email.send_template("sales_intro", to=lead.email)`,
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

export default function WorkflowView() {
    const [code, setCode] = useState(TEMPLATES[0].code)
    const [theme, setTheme] = useState("vs")
    const [font, setFont] = useState(EDITOR_FONTS[0].value)

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center justify-between px-4 h-14 border-b bg-background">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <PlugZap className="w-5 h-5" />
                        <h1 className="font-medium">New Workflow</h1>
                    </div>

                    <div className="h-6 w-px bg-border" />

                    <Select onValueChange={(template) => setCode(TEMPLATES.find(t => t.name === template)?.code || "")}>
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
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Test
                    </Button>
                    <Button size="sm">Save</Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1">
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme={theme}
                        value={code}
                        onChange={(value) => setCode(value || "")}
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
                            language: "python",
                        }}
                    />
                </div>
                <IntegrationsPanel />
            </div>
        </div>
    )
} 