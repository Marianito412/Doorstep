import MainAppShell from "../components/MainAppShell.tsx";
import {
    Title,
    Text,
    Tabs,
    Group,
    Stack,
    Space,
    Card,
    Avatar,
    Badge,
    Button,
    Modal,
    TextInput,
    Rating, Textarea
} from "@mantine/core";
import {CalendarBlankIcon, CalendarSlashIcon, CalendarXIcon, ChatIcon} from "@phosphor-icons/react";
import {useEffect, useState} from "react";
import {useAuthContext} from "../context/AuthContext.tsx";
import {supabase} from "../lib/supabase.ts";
import dayjs from "../lib/dayjs.ts";
import {useDisclosure} from "@mantine/hooks";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";

type ClientServiceRequest = {
    request_id: string;
    service_id: string;
    service_title: string;
    provider_name: string;
    servicetime: string;       // ISO UTC string — pass through dayjs().tz() before displaying
    description: string | null;
    address: string | null;
    status: string;
    created_at: string;        // ISO UTC string
}

function getStatusColor(status: string): string{
    if (status == "Pendiente") {
        return "orange"
    }
    if (status == "Aceptado") {
        return "green"
    }
    if (status == "Rechazado") {
        return "red"
    }
    if (status == "Completado") {
        return "teal.9"
    }
    if (status == "Listo para iniciar") {
        return "indigo"
    }
    if (status == "Iniciado") {
        return "blue"
    }
    if (status == "Finalizado") {
        return "gray.5"
    }
    return "gray"
}

function FinishedServiceCard({csr}: {csr: ClientServiceRequest}){
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [isOpen, {open, close}] = useDisclosure(false)
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        initialValues: {
            rating: 0,
            comment: '',
        },
        validate: {
            rating: (value) => (value === 0 ? 'Por favor calificá tu experiencia' : null),
            comment: (value) => (value.trim().length === 0 ? 'Por favor agregá un comentario' : null),
        },
    });
    
    useEffect(() => {
        fetchPrice()
    }, []);
    
    async function fetchPrice(){
        const {data, error} = await supabase.from("services").select("*").eq("serviceid", csr.service_id);
        if (!data){
            console.log("failed fetching price")
            return;
        }
        setMinPrice(data[0].minprice)
        setMaxPrice(data[0].maxprice)
    }

    async function handleSubmitReview(values: typeof form.values) {
        setSubmitting(true);

        const { error } = await supabase.from('reviews').insert({
            servicerequestid: csr.request_id,
            rating: values.rating,
            comment: values.comment,
        });

        setSubmitting(false);

        if (error) {
            notifications.show({
                color: 'red',
                title: 'Error al enviar la reseña',
                message: error.message,
            });
            return;
        }

        notifications.show({
            color: 'green',
            title: '¡Reseña enviada!',
            message: 'Gracias por tu retroalimentación.',
        });

        form.reset();
        close();
    }
    
    return (
        <>
            <Modal opened={isOpen} onClose={close} title={csr.service_title}>
                <form onSubmit={form.onSubmit(handleSubmitReview)}>
                    <Stack>
                        <Title>Dejá tu reseña</Title>
                        <Stack gap={0}>
                            <Text fw={600}>¿Cómo calificarías tu experiencia?</Text>
                            <Rating
                                value={form.values.rating}
                                onChange={(value) => form.setFieldValue('rating', value)}
                            />
                        </Stack>
                        <Textarea
                            label={<Text fw={600}>¿Tenés algún comentario?</Text>}
                            {...form.getInputProps('comment')}
                        />
                        <Button type="submit" variant="outline" color="black" loading={submitting}>
                            Enviar Reseña
                        </Button>
                    </Stack>
                </form>
            </Modal>
            <Card>
                <Group align="flex-start">
                    <Avatar radius="xl" size={120}/>
                    <Stack gap={0}>
                        <Badge color={getStatusColor(csr.status)}>{csr.status}</Badge>
                        <Title order={3}>{csr.service_title}</Title>
                        <Text
                            c="gray.7"><CalendarBlankIcon/> {dayjs(csr.servicetime).format('dddd, MMM DD, [•] h:mm a')}
                        </Text>
                        <Text>{csr.description}</Text>
                    </Stack>
                    <Stack gap={0} align="flex-end">
                        <Text c="gray.8" fw={600}>Costo Estimado</Text>
                        <Title order={2} c="teal.9">₡{((minPrice + maxPrice) / 2).toString()}</Title>
                        <Button variant="outline" color="black" onClick={open}>Agregar reseña</Button>
                    </Stack>
                </Group>
                <Space h="md"/>
            </Card>
        </>
    );
}

function BookedServiceCard({csr}: {csr: ClientServiceRequest}){
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    
    useEffect(() => {
        fetchPrice()
    }, []);
    
    async function fetchPrice(){
        const {data, error} = await supabase.from("services").select("*").eq("serviceid", csr.service_id);
        if (!data){
            console.log("failed fetching price")
            return;
        }
        setMinPrice(data[0].minprice)
        setMaxPrice(data[0].maxprice)
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
    
    async function handleServiceStart(){
        await updateServiceRequestStatus(csr.request_id, "Iniciado");
    }
    
    return (
        <Card shadow="xl" withBorder>
            <Group align="flex-start">
                <Avatar radius="xl" size={120}/>
                <Stack gap={0}>
                    <Badge color={getStatusColor(csr.status)}>{csr.status}</Badge>
                    <Title order={3}>{csr.service_title}</Title>
                    <Text c="gray.7"><CalendarBlankIcon/>  {dayjs(csr.servicetime).format('dddd, MMM DD, [•] h:mm a')}</Text>
                    <Text>{csr.description}</Text>
                </Stack>
                <Stack gap={0} align="flex-end">
                    <Text c="gray.8" fw={600}>Costo Estimado</Text>
                    <Title order={2} c="teal.9">₡{((minPrice + maxPrice)/2).toString()}</Title>
                    {
                        csr.status == "Listo para iniciar" 
                        ? <Button onClick={handleServiceStart}>Iniciar Servicio</Button> : null
                    }
                    
                </Stack>
            </Group>
            <Space h="md"/>
            <Card.Section withBorder inheritPadding py="xs" bg="gray.1">
                <Group gap="xs" align="flex-end" justify="flex-end">
                    <Button color="#CCCCCC" c="black"><ChatIcon size={16}/><Space w={5}/>Contactar a {csr.provider_name}</Button>
                    <Button variant="outline" color="gray.8"><CalendarSlashIcon size={16}/><Space w={5}/>Reagendar Reserva</Button>
                    <Button variant="outline" color="red"><CalendarXIcon size={16}/><Space w={5}/>Cancelar Reserva</Button>
                </Group>
            </Card.Section>
        </Card>
    )
}

function BookedServices(){
    const { profile, loading: authLoading } = useAuthContext()
    const [serviceRequests, setServiceRequests] = useState<ClientServiceRequest[]>([])

    useEffect(() => {
        if (authLoading || !profile) return // wait until auth has resolved
        fetchClientServices()
    }, [authLoading, profile]);
    
    async function fetchClientServices(){
        const { data } = await supabase.rpc('get_requests_for_client', { p_client_id: profile?.profileid })
        
        console.log(data)
        setServiceRequests(data)
    }
    
    return (
        <MainAppShell>
            <Tabs color="black" defaultValue="active" variant="pills">
                <Stack mr={100} ml={100}>
                    <Group wrap="nowrap" justify="space-between" align="flex-end">
                        <Stack gap="xs">
                            <Title>Mis Servicios Contratados</Title>
                            <Text size="xl">Administra acá tus servicios que hayas contratado con proveedores de servicios de
                                Doorstep.</Text>
                        </Stack>
                        
                        <Tabs.List>
                            <Tabs.Tab value="active"><Text size="lg">Activos</Text></Tabs.Tab>
                            <Tabs.Tab value="past"><Text size="lg">Pasados</Text></Tabs.Tab>
                        </Tabs.List>
                        
                    </Group>
                    <Tabs.Panel value="active">
                        <Stack align="flex-start" justify="flex-start">
                            {
                                serviceRequests.filter((sr) => (
                                    sr.status == "Aceptado" ||
                                    sr.status == "Listo para iniciar" ||
                                    sr.status == "Iniciado" ||
                                    sr.status == "Rechazado"
                                ))
                                    .map((sr) => (
                                        <BookedServiceCard csr={sr}/>
                                    ))
                            }
                        </Stack>
                    </Tabs.Panel>
                    <Tabs.Panel value="past">
                        <Stack align="flex-start" justify="flex-start">
                            {
                                serviceRequests.filter((sr) => (
                                    sr.status == "Finalizado"
                                ))
                                    .map((sr) => (
                                        <FinishedServiceCard csr={sr}/>
                                    ))
                            }
                        </Stack>
                    </Tabs.Panel>
                </Stack>
            </Tabs>
        </MainAppShell>
    )
}

export default BookedServices