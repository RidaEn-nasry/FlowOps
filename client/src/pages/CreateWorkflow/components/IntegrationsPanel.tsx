import { IntegrationItem } from "./IntegrationItem"
import { FaSlack, FaLinkedin, FaSalesforce, FaGithub, FaStripe, FaJira } from 'react-icons/fa'
import { SiZendesk, SiMongodb, SiNotion, SiVercel, SiOdoo, SiLinear } from 'react-icons/si'
import { VscAzure } from "react-icons/vsc";

const INTEGRATIONS = [
    {
        name: "Slack",
        icon: <FaSlack />,
        connected: true,
    },
    {
        name: "LinkedIn",
        icon: <FaLinkedin />,
        connected: true,
    },
    {
        name: "Jira",
        icon: <FaJira />,
        connected: false,
    },
    {
        name: "Salesforce",
        icon: <FaSalesforce />,
        connected: true,
    },
    {
        name: "Zendesk",
        icon: <SiZendesk />,
        connected: false,
    },
    {
        name: "Odoo",
        icon: <SiOdoo />,
        connected: false,
    },
    {
        name: "GitHub",
        icon: <FaGithub />,
        connected: false,
    },
    {
        name: "MongoDB",
        icon: <SiMongodb />,
        connected: false,
    },
    {
        name: "Notion",
        icon: <SiNotion />,
        connected: false,
    },
    {
        name: "Vercel",
        icon: <SiVercel />,
        connected: false,
    },
    {
        name: "Linear",
        icon: <SiLinear />,
        connected: false,
    },
    {
        name: "Stripe",
        icon: <FaStripe />,
        connected: false,
    },
    {
        name: "Azure",
        icon: <VscAzure />,
        connected: false,
    },
]

export function IntegrationsPanel() {
    return (
        <div className="w-[280px] border-l bg-background">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-sm">Available Integrations</h2>
            </div>
            <div className="p-2 space-y-1">
                {INTEGRATIONS.map((integration) => (
                    <IntegrationItem
                        key={integration.name}
                        name={integration.name}
                        icon={integration.icon}
                        connected={integration.connected}
                        onConnect={() => console.log(`Connect ${integration.name}`)}
                    />
                ))}
            </div>
        </div>
    )
} 