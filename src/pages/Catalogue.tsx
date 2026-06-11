import MainAppShell from "../components/MainAppShell.tsx";
import {
    Card, Group, Space, Stack, Title, Text, Button, Box, Select, RangeSlider,
    Avatar, Modal, type RangeSliderValue
} from "@mantine/core";
import {FunnelIcon} from "@phosphor-icons/react";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {supabase} from "../lib/supabase.ts";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

type Service = {
    serviceid: string
    title: string
    description: string
    maxprice: number,
    minprice: number,
    pricetype: string
}

function CatalogueEntry({service}: {service: Service}) {
    const isMobile = useMediaQuery('(max-width: 768px)')

    function truncateHtml(html: string, maxChars: number): string {
        const doc   = new DOMParser().parseFromString(html, 'text/html')
        const plain = doc.body.textContent ?? ''
        if (plain.length <= maxChars) return plain
        return plain.slice(0, maxChars).trimEnd() + '...'
    }
    
    return (
        <Card orientation={isMobile ? 'vertical' : 'horizontal'} withBorder maw="1200" component="a" href={"service?id="+service.serviceid}>
            <Avatar radius="xl" size={150}/>
            <Space w="30"/>
            <Stack align="stretch" w="100%">
                <Group justify="space-between" wrap={isMobile? "wrap" : "nowrap"} align="flex-start">
                    <Title order={2}>{service.title}</Title>
                    <Title order={3} c="#006A6A" textWrap="nowrap">
                        {service.minprice===service.maxprice ? "₡"+service.minprice : "₡"+service.minprice+" - "+"₡"+service.maxprice} {service.pricetype === "hourly" ? "/hr" : ""}
                    </Title>
                </Group>
                {truncateHtml(service.description, 300)}
                
                {/*<Group>
                    <Button variant="light" color="cyan">Book Now</Button>
                    <Button variant="outline">View Profile</Button>
                </Group>*/}
                
            </Stack>
        </Card>
    )
}

function SearchFilter(){
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [cities, setCities] = useState<string[]>(["None"])

    useEffect(() => {
        getCities()
    }, []);
    
    async function getCities(){
        const {error, data} = await supabase.from("providerprofiles").select("city")
        if (error) {
            console.error(error);
            return;
        }
        console.log(data)
        if (data){
            const foundCities: Set<string> = new Set(data.map((value) => (value.city)))
            setCities([...foundCities])
        }
    }
    
    function handleCityFilter(value: string | null){
        const params = new URLSearchParams(searchParams)
        if (value) params.set('city', value)
        else       params.delete('city')
        navigate({ pathname: '/', search: `?${params.toString()}` })
    }
    
    function handlePriceRange(value: RangeSliderValue){
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set('minPrice', String(value[0]))
            params.set('maxPrice', String(value[1]))
        }
        else{
            params.delete('minPrice')
            params.delete('maxPrice')
        }
        navigate({ pathname: '/', search: `?${params.toString()}` })
    }
    
    return (
        <Stack align="stretch">
            <Group justify="space-between" align="flex-end">
                <Title order={2}>Filter</Title>
                {/*<Anchor>Clear All</Anchor>*/}
            </Group>

            {/*<Stack gap={5}>
                <Title fw={600} order={4}>Service Type</Title>
                <Checkbox size="sm" defaultChecked label="This is a lot of text"/>
                <Checkbox size="sm" defaultChecked label="This is a lot of text"/>
                <Checkbox size="sm" defaultChecked label="This is a lot of text"/>
            </Stack>*/}

            <Stack gap={2}>
                <Title fw={600} order={4}>City</Title>
                <Select
                    placeholder="Select a City"
                    data={cities}
                    onChange={handleCityFilter}
                />
            </Stack>

            <Stack gap={2}>
                <Title fw={600} order={4}>Price</Title>
                <RangeSlider color="blue" onChangeEnd={handlePriceRange} defaultValue={[7000, 12000]} min={0} max={100000} step={2000}/>
            </Stack>

            
            {/*<Stack gap={2}>
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
            </Stack>*/}
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

type SearchFilters = {
    query?:          string
    city?:           string
    category?:       number
    minPrice?:       number
    maxPrice?:       number
}

function Catalogue(){
    const isMobile = useMediaQuery('(max-width: 768px)')
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState<Service[]>([])

    useEffect(() => {
        const query = searchParams.get('search')
        console.log('search param changed:', query) // does this fire?
        getSearchData({
            query:    searchParams.get('search')   ?? '',
            city:     searchParams.get('city')     ?? undefined,
            category: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
            minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
            maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        })
        /*
        if (query) {
            getSearchData({
                query:    searchParams.get('search')   ?? '',
                city:     searchParams.get('city')     ?? undefined,
                category: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
                minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
                maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
            })
        }
        else
        {
            fetchLatest()
        }
         */
    }, [searchParams])
    
    async function getSearchData(filters: SearchFilters){
        if (filters.query){
            console.log("fuck")
            const { data, error } = await supabase.rpc("search_services", {
                query:            filters.query        ?? '',
                filter_city:      filters.city         ?? null,
                filter_category:  filters.category     ?? null,
                filter_min_price: filters.minPrice     ?? null,
                filter_max_price: filters.maxPrice     ?? null,
            });
            if (error) {
                console.error(error);
                return;
            }
            setSearchResults(data);
            console.log(data)    
        }
        else{
            console.log("no fuck")
            // Sin búsqueda, traer los más recientes con filtros aplicados
            let q = supabase
                .from('services')
                .select(`
        serviceid,
        title,
        description,
        minprice,
        maxprice,
        pricetype,
        providerprofiles!inner (
          city,
          profiles!inner (fullname)
        )
      `)
                .order('createdat', { ascending: false })
                .limit(10)

            if (filters.city)     q = q.eq('providerprofiles.city', filters.city)
            if (filters.category) q = q.eq('servicecategoryid', filters.category)
            if (filters.minPrice) q = q.gte('minprice', filters.minPrice)
            if (filters.maxPrice) q = q.lte('maxprice', filters.maxPrice)

            const { data, error } = await q
            if (!error) setSearchResults(data)
            console.log(data)
        }
        
    }

    /*
    async function fetchLatest() {
        console.log("Latest fetched")
        const { data, error } = await supabase
            .from('services')
            .select(`
      serviceid,
      title,
      description,
      minprice,
      maxprice,
      pricetype
    `)
            .order('createdat', { ascending: false })
            .limit(20)

        if (!error) setSearchResults(data)
        console.log(data)
    }
     */
    
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
                            <Title>{searchResults.length} {searchResults.length<=1 ? "Professional":"Professionals"} found</Title>
                            <Group gap="md">
                                {isMobile? <FilterButton/>:null}
                                <Text c="dimmed">Sort by: </Text>
                                <Select
                                    placeholder="Recommended"
                                    data={['Recommended', 'Highest Rated', 'Price: Low to High']}
                                />
                            </Group>
                        </Group>
                        {
                            searchResults.map((item, index) => (
                                <CatalogueEntry service={item} key={index}/>
                            ))
                        }
                        {/*<Pagination total={10} />*/}
                    </Stack>
                </Group>
            </Box>
        </MainAppShell>
    );
}

export default Catalogue;