import {Button, Card, Group, NumberFormatter, Stack, Text, Title} from "@mantine/core";
import MainAppShell from "../components/MainAppShell.tsx";
import type {ReactNode} from "react";
import {CalendarDotsIcon, ClipboardTextIcon, WalletIcon} from "@phosphor-icons/react";

function ServiceRequestCard(){
    return (
        <Card withBorder shadow="xl">
            <Group justify="space-between">
                <Stack gap={0}>
                    <Title order={2} fw={600} pb={0} mb={0}>Título de la solicitud</Title>
                    <Group gap="xs" mt={0}>
                        <Text fw={650} c="gray.7" size="sm">Nombre de cliente</Text>
                        <Text fw={400} c="grey.7" size="sm">• dirección aproximada</Text>
                    </Group>

                </Stack>
                <Group gap="xs" mt={0}>
                    <Button size="md" variant="outline" color="black">Rechazar</Button>
                    <Button size="md" color="#BEBBB6" c="black" style={{border: "2px solid black"}}>Aceptar</Button>
                </Group>
            </Group>
        </Card>
    );
}

function ProviderStatCard({title, children, icon}: {title: string, children: ReactNode, icon: ReactNode}) {
    return (
        <Card withBorder shadow="xl">
            <Group justify="space-between">
                <Stack gap={0}>
                    <Title order={5} fw={600}>{title}</Title>
                    <Title>{children}</Title>    
                </Stack>
                {icon}
            </Group>
        </Card>
    );
}

function ProviderDashboard() {
    return (
        <MainAppShell>
            <Group wrap="nowrap" justify="center" align="flex-start">
                <Stack>
                    <Group justify="space-between">
                        <ProviderStatCard title={"Solicitudes Pendientes"} icon={<ClipboardTextIcon weight="duotone" size={64}/>}>
                            {Number(12).toString().padStart(2, '0')}
                        </ProviderStatCard>
                        <ProviderStatCard title={"Trabajos Programados"} icon={<CalendarDotsIcon weight="duotone" size={64}/>}>
                            {Number(3).toString().padStart(2, '0')}
                        </ProviderStatCard>
                    </Group>
                    <Title>Solicitudes Pendientes</Title>
                    <ServiceRequestCard/>
                    <ServiceRequestCard/>
                    <ServiceRequestCard/>
                </Stack>
                <Stack>
                    <ProviderStatCard title={"Ganancias estimadas"} icon={<WalletIcon weight="duotone" size={64}/>}>
                        <NumberFormatter prefix={"₡"} value={1200000} thousandSeparator></NumberFormatter>
                    </ProviderStatCard>
                </Stack>
                
            </Group>
        </MainAppShell>  
    );
}

export default ProviderDashboard;