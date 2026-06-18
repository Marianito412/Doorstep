import {
    ActionIcon,
    AppShell,
    Burger,
    Group,
    NavLink,
    SegmentedControl,
    TextInput,
    Title,
    UnstyledButton
} from "@mantine/core";

import {useDisclosure} from "@mantine/hooks";
import {ArrowRightIcon, DoorOpenIcon, MagnifyingGlassIcon} from '@phosphor-icons/react';
import {type ReactNode, useState} from "react";
import {useNavigate, useLocation, useSearchParams} from "react-router-dom";

const links = [
    /*
    {
        value: "/",
        label: (
            <Title order={3}>Home</Title>
        )
    },
    {
        value: '/catalogue',
        label: (
            <Title order={3}>Catalogue</Title>
        ),
    },
    */
    {
        value: '/support',
        label: (
            <Title order={3}>Support</Title>
        ),
    }
]

function SearchBar(){
    const [query, setQuery] = useState('')
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    
    function onSearch() {
        if (!query.trim()) return
        const params = new URLSearchParams(searchParams)
        if (query) params.set('search', query)
        else       params.delete('search')
        navigate({ pathname: '/', search: `?${params.toString()}` })
    }
    
    return (
        <TextInput
            radius="xl"
            size="md"
            w="600"
            placeholder="Search services"
            onKeyDown={(e) => {
                if (e.key === 'Enter'){
                    e.preventDefault()
                    onSearch()   
                }
            }}
            onChange={(e) => setQuery(e.currentTarget.value)}
            rightSectionWidth={42}
            leftSection={<MagnifyingGlassIcon size={32} />}
            rightSection={
                <ActionIcon onClick={(e) => {
                   e.preventDefault()
                   onSearch() 
                }} size={32} radius="xl" color="#BEBBB6" aria-label="Search">
                    <ArrowRightIcon color="black" size={18} stroke="2" />
                </ActionIcon>
            }
            aria-label="Search questions"
        />
    );
}

function MainAppShell({children}: {children: ReactNode}) {
    const [opened, { toggle }] = useDisclosure();
    const navigate = useNavigate();
    const location = useLocation();
    
    const onSegmenteControlChange = (value: string) => {
        navigate(value)
    }
    
    const navItems = links.map((link) => {
        return <NavLink href={link.value} label={link.label}></NavLink>
    })
    
    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" justify="space-between">
                    <Group hiddenFrom="sm">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <UnstyledButton component="a" href="/">
                            <Title><DoorOpenIcon weight="duotone"/>Doorstep</Title>    
                        </UnstyledButton>
                    </Group>
                    
                    <Group ml="10" visibleFrom="sm">
                        <UnstyledButton component="a" href="/">
                            <Title><DoorOpenIcon weight="duotone"/>Doorstep</Title>
                        </UnstyledButton>
                    </Group>

                    <SearchBar/>
                    
                    <SegmentedControl value={location.pathname} mr="70" visibleFrom="sm" data={links} onChange={onSegmenteControlChange}></SegmentedControl>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar>
                {navItems}
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    )
}

export default MainAppShell