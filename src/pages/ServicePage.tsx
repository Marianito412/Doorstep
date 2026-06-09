import MainAppShell from "../components/MainAppShell.tsx";
import {Image, Box, Card, Group, Stack, Text, Title, Button, Divider, Space, Avatar, Typography} from "@mantine/core";
import {StarIcon} from "@phosphor-icons/react";
import {supabase} from "../lib/supabase.ts";
import {useEffect, useState} from "react";
import {useMediaQuery} from "@mantine/hooks";
import {useSearchParams} from "react-router-dom";

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

function PriceCard({minPrice, maxPrice, priceType}: PriceProps){
    return (
        <Card shadow="lg" padding="lg" withBorder miw={350}>
            <Card.Section bg="gray.2">
                <Group align="self-end" gap={3} mx="lg" mt="lg">
                    <Title fw={600} c="teal.9">{minPrice}-{maxPrice} {priceType === "hourly" ? "$/hr":""}</Title>
                    <Text c="gray.7" fw={600}>/hour</Text>
                </Group>
                <Text ml="lg" c="gray.7" fw={600}>*Starting rate for standard service</Text>
                <Divider mt="md" mx="0"/>
            </Card.Section>

            <Group justify="space-between" mx="sm" mt="md">
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
            </Group>
            
            <Space h="xs"/>
            <Stack gap="xs">
                <Button size="md" fullWidth variant="filled" color="cyan">Hire Now!</Button>
                <Button size="md" fullWidth variant="outline">Contact</Button>
            </Stack>
        </Card>
    )
}

function ServiceProviderCard({name}: {name: string}){
    return (
        <Card shadow="lg" orientation="horizontal" withBorder>
            <Avatar radius={120} size={120} color="indigo"/>
            <Space w="30"/>
            <Stack>
                <Title order={2} fw={600}>Service Provided by {name}</Title>
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
    categoryname: string
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
                        title="Premium Eco-Friendly House Cleaning"
                        rating={4.9}
                        reviewCount={128}
                        imageUrl="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
                    />
                    <ServiceProviderCard name = {service ? service.fullname : ""}/>
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
                    <PriceCard minPrice={9.99} maxPrice={300} priceType="100"/>
                </Stack>
            </Group>
        </MainAppShell>
    )
}

export default ServicePage;