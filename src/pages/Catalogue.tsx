import MainAppShell from "../components/MainAppShell.tsx";
import {Card, Group, Space, Stack, Title, Text, Button, Box, Select, Checkbox, RangeSlider, Chip,
    Pagination, Avatar, Modal} from "@mantine/core";
import {FunnelIcon, StarIcon} from "@phosphor-icons/react";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";

function CatalogueEntry(){
    const isMobile = useMediaQuery('(max-width: 768px)')
    
    return (
        <Card orientation={isMobile ? 'vertical' : 'horizontal'} withBorder maw="1000">
            <Avatar radius="xl" size={150}/>
            <Space w="30"/>
            <Stack align="stretch" w="100%">
                <Group justify="space-between">
                    <Title order={2}>Service Name</Title>
                    <Title order={3} c="#006A6A">$150/hr</Title>
                </Group>
                <Text lineClamp={3}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lobortis eu metus non cursus. Quisque vitae lorem consequat elit ornare bibendum porttitor non lectus. Ut euismod purus sed nibh luctus imperdiet. Curabitur ex sapien, suscipit euismod ante vel, molestie placerat est. Vestibulum tincidunt nibh sagittis, facilisis libero sed, pulvinar lorem. Sed laoreet hendrerit velit, sit amet condimentum orci blandit eget. Aenean at efficitur eros. Integer vel ante ut magna scelerisque varius. </Text>
                <Group>
                    <Button variant="light" color="cyan">Book Now</Button>
                    <Button variant="outline">View Profile</Button>
                </Group>
            </Stack>
        </Card>
    )
}

function SearchFilter(){
    
    const cities=["Cartago", "San Rafael", "Tres Rios"]

    return (
        <Stack align="stretch">
            <Group justify="space-between" align="flex-end">
                <Title order={2}>Filter</Title>
                <Text size="lg">Clear all</Text>
            </Group>

            <Stack gap={5}>
                <Title fw={600} order={4}>Service Type</Title>
                <Checkbox size="sm" defaultChecked label="This is a lot of text"/>
                <Checkbox size="sm" defaultChecked label="This is a lot of text"/>
                <Checkbox size="sm" defaultChecked label="This is a lot of text"/>
            </Stack>

            <Stack gap={2}>
                <Title fw={600} order={4}>City</Title>
                <Select
                    placeholder="Recommended"
                    data={cities}
                />
            </Stack>

            <Stack gap={2}>
                <Title fw={600} order={4}>Price</Title>
                <RangeSlider color="blue" defaultValue={[20, 60]} min={0} max={300} step={10}/>
            </Stack>

            <Stack gap={2}>
                <Title fw={600} order={4}>Minimum Rating</Title>
                <Chip.Group>
                    <Stack gap={3}>
                        <Chip value="1" variant="outline"><Text><StarIcon weight="duotone"/> 2.5+ Stars</Text></Chip>
                        <Chip value="2" variant="outline"><Text><StarIcon weight="duotone"/> 3.0+ Stars</Text></Chip>
                        <Chip value="3" variant="outline"><Text><StarIcon weight="duotone"/> 4.0+ Stars</Text></Chip>
                        <Chip value="4" variant="outline"><Text><StarIcon weight="duotone"/> 4.5+ Stars</Text></Chip>
                        <Chip value="5" variant="outline"><Text><StarIcon weight="duotone"/> 5.0+ Stars</Text></Chip>
                    </Stack>
                </Chip.Group>
            </Stack>
        </Stack>
    )
}

function FilterButton(){
    const [opened, { open, close }] = useDisclosure(false);
    
    return (
        <>
            <Modal opened={opened} onClose={close} title="Search Filters">
                <SearchFilter/>
            </Modal>

            <Button variant="default" onClick={open}>
                <FunnelIcon size={32} weight="duotone" />
            </Button>
        </>
    )
}

function Catalogue(){
    const isMobile = useMediaQuery('(max-width: 768px)')
    return (
        <MainAppShell>
            <Box py="xl">
                <Group wrap="nowrap" justify="center" align="flex-start">
                    {isMobile? null:
                        <Card withBorder style={{flexShrink: 0}}>
                            <SearchFilter />
                        </Card>
                    }
                    <Stack align="stretch" justify="flex-start" gap="md">
                        <Group justify="space-between">
                            <Title>124 Professionals found</Title>
                            <Group gap="md">
                                {isMobile? <FilterButton/>:null}
                                <Text c="dimmed">Sort by: </Text>
                                <Select
                                    placeholder="Recommended"
                                    data={['Recommended', 'Highest Rated', 'Price: Low to High']}
                                />
                            </Group>
                        </Group>
                        <CatalogueEntry/>
                        <CatalogueEntry/>
                        <CatalogueEntry/>
                        <CatalogueEntry/>
                        <CatalogueEntry/>
                        <CatalogueEntry/>
                        <CatalogueEntry/>
                        <Pagination total={10} />
                    </Stack>
                </Group>
            </Box>
        </MainAppShell>
    );
}

export default Catalogue;