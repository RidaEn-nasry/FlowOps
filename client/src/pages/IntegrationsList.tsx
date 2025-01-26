import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'
import {
    FaSlack, FaGithub, FaStripe, FaJira, FaIntercom,
    FaLinkedin, FaSalesforce,
    FaAws
} from 'react-icons/fa'
import {
    SiOpenai, SiMongodb, SiPostgresql, SiRedis, SiClickup,
    SiZendesk, SiLinear, SiNotion, SiVercel, SiOdoo,
    SiDiscord, SiTwilio, SiAirtable, SiAsana, SiZoom,
    SiGooglecloud,
    SiShopify,
    SiDropbox,
    SiHubspot
} from 'react-icons/si'
import { VscAzure } from 'react-icons/vsc'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const MAIN_CATEGORIES = [
    "Most Popular",
    "Recently Added",
    "Communication",
    "Developer Tools",
    "Business & CRM",
    "Data & Analytics",
    "Project Management",
    "More"
] as const

const ALL_CATEGORIES = [
    ...MAIN_CATEGORIES.slice(0, -1),
    "Sales & Marketing",
    "Cloud Services",
    "AI & Machine Learning",
    "Security & Compliance",
    "Productivity",
    "Customer Support"
] as const

const INTEGRATIONS = [
    {
        name: "Slack",
        description: "Team communication and collaboration platform",
        icon: <FaSlack />,
        category: "Communication & Collaboration",
        connected: true,
        popular: true
    },
    {
        name: "Discord",
        description: "Voice, video and text communication platform",
        icon: <SiDiscord />,
        category: "Communication & Collaboration",
        connected: false,
        new: true
    },
    {
        name: "LinkedIn",
        description: "Professional networking and recruitment",
        icon: <FaLinkedin />,
        category: "Business & CRM",
        connected: true,
        popular: true
    },
    {
        name: "Salesforce",
        description: "Customer relationship management platform",
        icon: <FaSalesforce />,
        category: "Business & CRM",
        connected: true,
        popular: true
    },
    {
        name: "Zendesk",
        description: "Customer service and engagement platform",
        icon: <SiZendesk />,
        category: "Business & CRM",
        connected: false,
        popular: true
    },
    {
        name: "Odoo",
        description: "Business management software suite",
        icon: <SiOdoo />,
        category: "Business & CRM",
        connected: false,
        new: true
    },
    {
        name: "OpenAI",
        description: "AI models for text, code, and image generation",
        icon: <SiOpenai />,
        category: "AI & Machine Learning",
        connected: true,
        popular: true
    },
    {
        name: "GitHub",
        description: "Code hosting and collaboration platform",
        icon: <FaGithub />,
        category: "Developer Tools",
        connected: true,
        popular: true
    },
    {
        name: "MongoDB",
        description: "NoSQL database for modern applications",
        icon: <SiMongodb />,
        category: "Data & Analytics",
        connected: false,
        popular: true
    },
    {
        name: "Linear",
        description: "Issue tracking and project management",
        icon: <SiLinear />,
        category: "Project Management",
        connected: false,
        new: true
    },
    {
        name: "Notion",
        description: "All-in-one workspace for notes and docs",
        icon: <SiNotion />,
        category: "Project Management",
        connected: false,
        popular: true
    },
    {
        name: "Stripe",
        description: "Payment processing platform",
        icon: <FaStripe />,
        category: "Business & CRM",
        connected: false,
        popular: true
    },
    {
        name: "PostgreSQL",
        description: "Open source relational database",
        icon: <SiPostgresql />,
        category: "Data & Analytics",
        connected: false,
        popular: true
    },
    {
        name: "Redis",
        description: "In-memory data structure store",
        icon: <SiRedis />,
        category: "Data & Analytics",
        connected: false
    },
    {
        name: "Jira",
        description: "Issue and project tracking",
        icon: <FaJira />,
        category: "Project Management",
        connected: false,
        popular: true
    },
    {
        name: "Intercom",
        description: "Customer messaging platform",
        icon: <FaIntercom />,
        category: "Communication & Collaboration",
        connected: false
    },
    {
        name: "Vercel",
        description: "Frontend deployment platform",
        icon: <SiVercel />,
        category: "Developer Tools",
        connected: false,
        new: true
    },
    {
        name: "Azure",
        description: "Cloud computing platform",
        icon: <VscAzure />,
        category: "Cloud Services",
        connected: false,
        popular: true
    },
    {
        name: "AWS",
        description: "Amazon Web Services cloud platform",
        icon: <FaAws />,
        category: "Cloud Services",
        connected: false,
        popular: true
    },
    {
        name: "Google Cloud",
        description: "Google's cloud computing services",
        icon: <SiGooglecloud />,
        category: "Cloud Services",
        connected: false,
        popular: true
    },
    {
        name: "Twilio",
        description: "Communication APIs for SMS, voice, and video",
        icon: <SiTwilio />,
        category: "Communication & Collaboration",
        connected: false,
        new: true
    },
    {
        name: "Airtable",
        description: "Spreadsheet-database hybrid platform",
        icon: <SiAirtable />,
        category: "Data & Analytics",
        connected: false,
        new: true
    },
    {
        name: "Asana",
        description: "Project and task management platform",
        icon: <SiAsana />,
        category: "Project Management",
        connected: false
    },
    {
        name: "Zoom",
        description: "Video conferencing and communication",
        icon: <SiZoom />,
        category: "Communication & Collaboration",
        connected: false,
        popular: true
    },
    {
        name: "ClickUp",
        description: "Project management and productivity platform",
        icon: <SiClickup />,
        category: "Project Management",
        connected: false,
        new: true
    },
    {
        name: "Shopify",
        description: "E-commerce platform",
        icon: <SiShopify />,
        category: "Business & CRM",
        connected: false,
        new: true
    },
    {
        name: "HubSpot",
        description: "CRM and marketing automation platform",
        icon: <SiHubspot />,
        category: "Business & CRM",
        connected: false,
        new: true
    },
    {
        name: "Dropbox",
        description: "Cloud storage and file sharing",
        icon: <SiDropbox />,
        category: "Cloud Services",
        connected: false,
        popular: true
    }

]

export default function IntegrationsList() {
    const [activeCategory, setActiveCategory] = useState<typeof ALL_CATEGORIES[number]>("Most Popular")
    const [search, setSearch] = useState("")
    const [showAllCategories, setShowAllCategories] = useState(false)

    const filteredIntegrations = INTEGRATIONS.filter(integration => {
        if (search) {
            return integration.name.toLowerCase().includes(search.toLowerCase()) ||
                integration.description.toLowerCase().includes(search.toLowerCase())
        }
        if (activeCategory === "Most Popular") return integration.popular
        if (activeCategory === "Recently Added") return integration.new
        return integration.category === activeCategory
    })

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
                    <p className="text-sm text-muted-foreground">
                        Connect your workflow with your favorite tools and services
                    </p>
                </div>
                <div className="relative w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search integrations..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 border-b">
                {MAIN_CATEGORIES.map((category) => (
                    <Button
                        key={category}
                        variant={activeCategory === category ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                            if (category === "More") {
                                setShowAllCategories(true)
                            } else {
                                setActiveCategory(category)
                            }
                        }}
                        className="rounded-none relative -bottom-[1px]"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations.map((integration) => (
                    <Card key={integration.name} className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    {React.cloneElement(integration.icon as any, { className: 'h-6 w-6 text-primary' })}
                                </div>
                                <div>
                                    <h3 className="font-medium">{integration.name}</h3>
                                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                                </div>
                            </div>
                            <Button
                                variant={integration.connected ? "secondary" : "outline"}
                                size="sm"
                            >
                                {integration.connected ? "Connected" : "Connect"}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={showAllCategories} onOpenChange={setShowAllCategories}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>All Categories</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-2 py-4">
                        {ALL_CATEGORIES.map((category) => (
                            <Button
                                key={category}
                                variant={activeCategory === category ? "default" : "outline"}
                                onClick={() => {
                                    setActiveCategory(category)
                                    setShowAllCategories(false)
                                }}
                                className="justify-start"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
} 