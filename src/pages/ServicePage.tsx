import MainAppShell from "../components/MainAppShell.tsx";
import {
    Image,
    Box,
    Card,
    Group,
    Stack,
    Text,
    Title,
    Button,
    Divider,
    Space,
    Avatar,
    Typography,
    Modal,
    TextInput,
    Textarea
} from "@mantine/core";
import '@mantine/dates/styles.css'
import {CheckCircleIcon, StarIcon} from "@phosphor-icons/react";
import {supabase} from "../lib/supabase.ts";
import {useEffect, useState} from "react";
import {useMediaQuery} from "@mantine/hooks";
import {useSearchParams} from "react-router-dom";
import {DateTimePicker} from "@mantine/dates";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";

type ServiceCardProps = {
    title: string
    rating: number
    reviewCount: number
    imageUrl: string
}

function ServiceCard({ title, rating, reviewCount, imageUrl }: ServiceCardProps) {
    return (
        <Card shadow="lg" radius="md" p={0} style={{ overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
            <Image src={imageUrl} h={400}/>
            {/* Gradient overlay */}
            <Box
                style={{
                    position:   'absolute',
                    bottom:     0,
                    left:       0,
                    right:      0,
                    height:     '65%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                }}
            />

            {/* Text content over the gradient */}
            <Box
                style={{
                    position: 'absolute',
                    bottom:   0,
                    left:     0,
                    right:    0,
                    padding:  '16px',
                }}
            >
                <Text fw={700} size="xl" c="white" mb={4}>
                    {title}
                </Text>
                <Group gap={6} align="center">
                    <StarIcon size={16} weight="fill" color="#20C997" />
                    <Text c="white" size="sm" fw={600}>{rating}</Text>
                    <Text c="rgba(255,255,255,0.75)" size="sm">
                        ({reviewCount} Verified Reviews)
                    </Text>
                </Group>
            </Box>
        </Card>
    )
}

type PriceProps = {
    minPrice: number
    maxPrice: number
    priceType: string
}

type BookingFormValues = {
    scheduled_at: Date | null
    description:  string
    address:      string
}

function PriceCard({minPrice, maxPrice, priceType}: PriceProps){
    const [opened, setOpened] = useState(false)
    const [loading, setLoading] = useState(false)

    const delay = (ms: number): Promise<void> => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    
    const form = useForm<BookingFormValues>({
        initialValues: {
            scheduled_at: null,
            description:  '',
            address:      '',
        },
        validate: {
            scheduled_at: (val) => !val ? 'Seleccioná una fecha y hora' : null,
            address:      (val) => val.trim().length < 5 ? 'Ingresá una dirección válida' : null,
        }
    })

    async function handleSubmit(values: BookingFormValues) {
        console.log(values.address)
        setLoading(true)
        await delay(1000);
        setLoading(false)
        setOpened(false)

        notifications.show({
            title:   '¡Reserva confirmada!',
            message: 'Tu solicitud fue enviada. El proveedor la revisará pronto.',
            color:   'teal',
            icon:    <CheckCircleIcon size={20} weight="fill" />,
        })
    }
    
    return (
        <>
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Reservar servicio"
            centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <DateTimePicker
                        label="Fecha y hora"
                        placeholder="Seleccioná cuándo necesitás el servicio"
                        minDate={new Date()}
                        {...form.getInputProps('scheduled_at')}
                    />

                    <TextInput
                        label="Dirección"
                        placeholder="Ej: De la Iglesia 200m norte, casa verde"
                        {...form.getInputProps('address')}
                    />

                    <Textarea
                        label="Descripción"
                        placeholder="Describí brevemente qué necesitás. Ej: jardín de 80m², incluye poda y abono"
                        rows={4}
                        {...form.getInputProps('description')}
                    />

                    <Button type="submit" loading={loading} fullWidth>
                        Confirmar reserva
                    </Button>
                </Stack>
            </form>
        </Modal>
        
        <Card shadow="lg" padding="lg" withBorder miw={350}>
            <Card.Section bg="gray.2">
                <Group align="self-end" gap={3} mx="lg" mt="lg">
                    <Title order={2} fw={600} c="teal.9">
                        ₡{minPrice===maxPrice ? minPrice : minPrice + "-" + maxPrice}
                    </Title>
                    <Text size="xl" c="gray.7" fw={600}>{priceType === "hourly" ? "/hr":""}</Text>
                </Group>
                <Text ml="lg" c="gray.7" fw={600}>*Starting rate for standard service</Text>
                <Divider mt="md" mx="0"/>
            </Card.Section>

            {/*<Group justify="space-between" mx="sm" mt="md">
                <Text fw={600} c="gray.7">Min. Booking</Text>
                <Text fw={600}>2 hours</Text>
            </Group>
            
            <Group justify="space-between" mx="sm">
                <Text fw={600} c="gray.7">Service Fee</Text>
                <Text fw={600}>$9.99</Text>
            </Group>
            
            <Divider my="md" mx="0"/>

            <Group justify="space-between" mx="sm" wrap="nowrap">
                <Title order={3} fw={600}>Estimated Total</Title>
                <Title order={3} fw={600} c="teal.9">$99.99</Title>
            </Group>*/}
            
            <Space h="xs"/>
            <Stack gap="xs">
                <Button size="md" fullWidth variant="filled" onClick={() => setOpened(true)}>Hire Now!</Button>
                <Button size="md" fullWidth variant="outline" component="a" href="mailto:john2@doe.com">Contact</Button>
            </Stack>
        </Card>
        </>
    )
}

function ServiceProviderCard({name, bio}: {name: string, bio: string}) {
    return (
        <Card shadow="lg" orientation="horizontal" withBorder>
            <Avatar radius={120} size={120} color="indigo"/>
            <Space w="30"/>
            <Stack>
                <Title order={2} fw={600}>Service Provided by {name}</Title>
                <Text>{bio}</Text>
            </Stack>
        </Card>
    )
}

type Service = {
    title: string
    description: string,
    fullname: string,
    pricetype: string,
    minprice: number,
    maxprice: number,
    categoryname: string,
    bio: string
}

function ServicePage(){
    let [service, setService] = useState<Service>();
    const [searchParams] = useSearchParams();
    const isMobile = useMediaQuery('(max-width: 768px)')

    const serviceId = searchParams.get("id") || "";
    console.log("TestQuery: ", serviceId);
    
    useEffect(() => {
        getServiceDisplayData()
    }, []);
    
    async function getServiceDisplayData(){
        const { data, error } = await supabase.rpc('get_service_display_data', { p_service_id: serviceId })
        if (error) {
            console.error(error);
            return;
        }
        console.log(data[0])
        setService(data[0]);
    }
    
    return (
        <MainAppShell>
            <Group wrap="nowrap" justify="center" align="flex-start" mt="lg" 
                   mx={isMobile ? 'sm' : 100}
                   px={isMobile ? 'sm' : 'xl'}
                   style={{flexDirection: isMobile ? 'column' : 'row'}}>
                <Stack style={{ flex: 1, width: '100%' }}>
                    <ServiceCard
                        title={service? service?.title:"Title"}
                        rating={4.9}
                        reviewCount={128}
                        imageUrl="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
                    />
                    <ServiceProviderCard name = {service ? service.fullname : ""} bio={service ? service.bio : ""}/>
                    <Title order={2} fw={600}>About this Service</Title>

                    {service ?
                        <Card shadow="lg" withBorder>
                            <Typography>
                                <div dangerouslySetInnerHTML={{__html: service.description}}/>
                            </Typography>
                        </Card>
                        : null}
                </Stack>
                <Stack style={{ width: isMobile ? '100%' : 320, flexShrink: 0 }}>
                    <PriceCard minPrice={service?.minprice || 0} maxPrice={service?.maxprice || 0} priceType={service?.pricetype || "hourly"}/>
                </Stack>
            </Group>
        </MainAppShell>
    )
}

export default ServicePage;