import { Button } from "@/components/ui/button"
import { FaSlack, FaGoogle, FaSalesforce, FaLinkedin, FaMicrosoft } from 'react-icons/fa'

interface IntegrationItemProps {
    name: string
    icon: React.ReactNode
    connected?: boolean
    onConnect: () => void
}

export function IntegrationItem({ name, icon, connected = false, onConnect }: IntegrationItemProps) {
    return (
        <div className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                    {icon}
                </div>
                <span className="font-medium text-sm">{name}</span>
            </div>
            <Button
                variant={connected ? "secondary" : "default"}
                size="sm"
                onClick={onConnect}
                className="text-xs"
            >
                {connected ? "Connected" : "Connect"}
            </Button>
        </div>
    )
}