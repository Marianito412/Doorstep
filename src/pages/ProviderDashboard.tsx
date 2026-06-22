import {
    Accordion, AccordionControl,
    AccordionItem, AccordionPanel,
    Button,
    Card, Collapse,
    Group,
    NumberFormatter, Space,
    Stack,
    Text, Timeline,
    Title, UnstyledButton
} from "@mantine/core";
import MainAppShell from "../components/MainAppShell.tsx";
import {type ReactNode, useEffect, useState} from "react";
import {CalendarDotsIcon, ClipboardTextIcon, ClockClockwiseIcon, WalletIcon} from "@phosphor-icons/react";
import {supabase} from "../lib/supabase.ts";
import {useAuthContext} from "../context/AuthContext.tsx";
import dayjs from "../lib/dayjs.ts";
import {useDisclosure} from "@mantine/hooks";

type ServiceRequest = {
    title: string
    servicerequestid: string
    clientprofileid: string
    serviceaddress: string
    servicedescription: string
    servicetime: string
    serviceendtime: string
    clientname: string
}

function ServiceRequestCard({sr}: {sr: ServiceRequest}) {
    
    async function reject(){
        await supabase.rpc('respond_to_service_request', {
            p_service_request_id: sr.servicerequestid,
            p_accepted: false, // or false to reject
        });
        
        console.log("Reject")
    }
    
    async function accept(){
        await supabase.rpc('respond_to_service_request', {
            p_service_request_id: sr.servicerequestid,
            p_accepted: true, // or false to reject
        });
        
        console.log("Accept");
    }
    
    return (
        <Card withBorder shadow="xl" maw={900} mb={15}>
            <Group justify="space-between" wrap="nowrap">
                <AccordionItem key={sr.servicerequestid} value={sr.servicerequestid}>
                    <AccordionControl>
                        <Stack gap={0}>
                            <Title order={3} fw={600}>{sr.title}</Title>
                            <Group gap="xs" mt={0}>
                                <Text fw={650} c="gray.7" size="sm">{sr.clientname}</Text>
                                <Text fw={400} c="grey.7" size="sm">• {sr.serviceaddress}</Text>
                                <Text fw={400} c="grey.7"
                                      size="sm">• {dayjs(sr.servicetime).format('D [de] MMMM YYYY, h:mm a')}</Text>
                            </Group>
                            <AccordionPanel>
                                {sr.servicedescription}
                            </AccordionPanel>
                        </Stack>
                    </AccordionControl>
                </AccordionItem>

                <Group gap="xs" mt={0} align="flex-end" justify="flex-end" wrap="nowrap">
                    <Button onClick={reject} size="md" variant="outline" color="black" w={120}>Rechazar</Button>
                    <Button onClick={accept} size="md" color="#CCCCCC" c="black" w={120}
                            style={{border: "2px solid black"}}>Aceptar</Button>
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

type statusData = {
    statusname: string
    order: number
}

function ScheduleItem({sr}: { sr: ServiceRequest }) {
    const { profile, loading: authLoading } = useAuthContext()
    const [expanded, { toggle }] = useDisclosure(false);
    const [status, setStatus] = useState<statusData>({statusname:"test", order:0});

    useEffect(() => {
        fetchStatus()
    }, [authLoading, profile]);
    
    async function fetchStatus(){
        const {data, error} = await supabase
            .from("servicerequests")
            .select('servicerequeststatus!servicerequeststatusid!inner(*)')
            .eq("servicerequestid", sr.servicerequestid)
            .single()
        
        if (!data){
            return;
        }
        setStatus(data.servicerequeststatus)
        console.log(status);
    }

    async function updateServiceRequestStatus(requestId: string, statusName: string): Promise<boolean> {
        // First resolve the status name to its ID
        const {data: status, error: statusError} = await supabase
            .from('servicerequeststatus')
            .select('servicerequeststatusid')
            .eq('statusname', statusName)
            .single();

        if (statusError || !status) {
            console.error('Error resolving status:', statusError);
            return false;
        }

        // Then update the request
        const {error} = await supabase
            .from('servicerequests')
            .update({servicerequeststatusid: status.servicerequeststatusid})
            .eq('servicerequestid', requestId);

        if (error) {
            console.error('Error updating service request status:', error);
            return false;
        }

        return true;
    }
    
    async function setReady(){
        await updateServiceRequestStatus(sr.servicerequestid, 'Listo para iniciar');
    }
    
    async function setFinished(){
        await updateServiceRequestStatus(sr.servicerequestid, 'Finalizado');
    }
    
    return (
        <>
            <Title order={4} c="teal.9">
                {dayjs(sr.servicetime).format("hh:mm")} - {dayjs(sr.serviceendtime).format("hh:mm")}
            </Title>

            <UnstyledButton onClick={toggle}>
                <Title order={4}>{sr.title}</Title>
            </UnstyledButton>
            <Text size="sm">{sr.serviceaddress}</Text>
            <Collapse expanded={expanded}>
                <Button fullWidth size="md" variant="outline" color="black">Contactar cliente</Button>
                <Space h={5}/>
                <Group wrap="nowrap" >
                    <Button disabled={status.order>1} onClick={setReady} fullWidth size="md" variant="outline" color="black">Listo para Iniciar!</Button>
                    <Button disabled={status.order!=3} onClick={setFinished} fullWidth size="md" variant="outline" color="teal.9" >Finalizar</Button>
                </Group>
            </Collapse>
        </>
    )
}

function ScheduleCard(){
    const { profile, loading: authLoading } = useAuthContext()
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
    
    useEffect(() => {
        if (authLoading || !profile) return // wait until auth has resolved
        fecthServiceRequests()
    }, [authLoading, profile]);
    
    async function fecthServiceRequests(){
        if (profile == null){
            console.log("No valid profile")
            return;
        }

        const {data} = await supabase.from("providerprofiles").select("providerprofileid").eq("profileid", profile.profileid)
        const providerid = data? data[0].providerprofileid : "null"

        const request = await supabase.rpc("get_accepted_service_requests_for_provider", {p_provider_id: providerid})
        const sorted = sortServiceRequestsByTime(request.data ?? []);
        setServiceRequests(sorted);
        console.log(serviceRequests)
    }

    function sortServiceRequestsByTime(requests: ServiceRequest[]): ServiceRequest[] {
        return requests.toSorted((a, b) =>
            dayjs(a.servicetime).unix() - dayjs(b.servicetime).unix()
        );
    }

    const upcomingIndex = serviceRequests.findIndex(request =>
        dayjs(request.servicetime).isAfter(dayjs())
    ) -1;
    
    return(
        <Card w={400}>
            <Group justify="space-between" wrap="nowrap">
                <Title order={3} textWrap="wrap">Agenda <br/> de Hoy</Title>
                <Title order={4} c="gray.7" mr={50}>
                    {dayjs().format('MMM DD,')}
                    <br/>
                    {dayjs().format('YYYY')}
                </Title>
            </Group>
            <Space h="xl"/>
            <Timeline active={upcomingIndex} color="teal.9">
                {
                    serviceRequests?.map((sr, idx)=>(
                        <Timeline.Item key={idx} bullet={<ClockClockwiseIcon />}>
                            <ScheduleItem sr={sr}/>
                        </Timeline.Item>
                    ))
                }
            </Timeline>
        </Card>
    )
}

function ProviderDashboard() {
    const { profile, loading: authLoading } = useAuthContext()
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>();

    useEffect(() => {
        if (authLoading || !profile) return // wait until auth has resolved
        fecthServiceRequests()
    }, [authLoading, profile]);
    
    async function fecthServiceRequests() {
        if (profile == null){
            console.log("No valid profile")
            return;
        }
        
        const {data} = await supabase.from("providerprofiles").select("providerprofileid").eq("profileid", profile.profileid)
        const providerid = data? data[0].providerprofileid : "null"
        
        const request = await supabase.rpc("get_service_requests_for_provider", {p_provider_id: providerid})
        setServiceRequests(request.data);
    }
    
    return (
        <MainAppShell>
            <Group wrap="nowrap" justify="center" align="flex-start">
                <Stack>
                    <Group justify="flex-start">
                        <ProviderStatCard title={"Solicitudes Pendientes"}
                                          icon={<ClipboardTextIcon weight="duotone" size={64}/>}>
                            {serviceRequests?.length.toString().padStart(2, '0')}
                        </ProviderStatCard>
                        <ProviderStatCard title={"Trabajos Programados"}
                                          icon={<CalendarDotsIcon weight="duotone" size={64}/>}>
                            {Number(3).toString().padStart(2, '0')}
                        </ProviderStatCard>
                    </Group>
                    <Title>Solicitudes Pendientes</Title>
                    <Accordion variant="unstyled" chevron={null}>
                        {serviceRequests?.map((serviceRequest, idx) => (
                            <ServiceRequestCard key={idx} sr={serviceRequest}/>
                        ))}
                    </Accordion>
                </Stack>
                <Stack>
                    <ProviderStatCard title={"Ganancias estimadas"} icon={<WalletIcon weight="duotone" size={64}/>}>
                        <NumberFormatter prefix={"₡"} value={1200000} thousandSeparator></NumberFormatter>
                    </ProviderStatCard>
                    <ScheduleCard/>
                </Stack>
            </Group>
        </MainAppShell>  
    );
}

export default ProviderDashboard;