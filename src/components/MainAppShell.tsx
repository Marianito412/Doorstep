import {
    ActionIcon,
    AppShell, Avatar,
    Burger,
    Group, Menu,
    NavLink,
    SegmentedControl,
    TextInput,
    Title,
    UnstyledButton
} from "@mantine/core";

import {useDisclosure} from "@mantine/hooks";
import {
    ArrowRightIcon,
    CheckSquareIcon,
    DoorOpenIcon,
    GearSixIcon,
    MagnifyingGlassIcon,
    SignOutIcon
} from '@phosphor-icons/react';
import {type ReactNode, useState} from "react";
import {useNavigate, useLocation, useSearchParams} from "react-router-dom";
import {useAuthContext} from "../context/AuthContext.tsx";

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
        value: '/bookedservices',
        label: (
            <Title order={4}>Servicios Contratados</Title>
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
            placeholder="Buscar servicios"
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
    
    const signOut = useAuthContext().signOut
    const profile = useAuthContext().profile
    //const user = useAuthContext().user
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const onSegmenteControlChange = (value: string) => {
        navigate(value)
    }
    
    const navItems = links.map((link, idx) => {
        return <NavLink key={idx} href={link.value} label={link.label}></NavLink>
    })
    
    async function handleLogout(){
        await signOut()
    }
    
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
                        <UnstyledButton component="button" onClick={() => {navigate("/")}}>
                            <Title><DoorOpenIcon weight="duotone"/>Doorstep</Title>    
                        </UnstyledButton>
                    </Group>
                    
                    <Group ml="10" visibleFrom="sm">
                        <UnstyledButton component="button" onClick={() => {navigate("/")}}>
                            <Title><DoorOpenIcon weight="duotone"/>Doorstep</Title>
                        </UnstyledButton>
                    </Group>

                    <SearchBar/>
                    <Group justify="flex-start" mr={70}>
                        <SegmentedControl value={location.pathname} visibleFrom="sm" data={links}
                                          onChange={onSegmenteControlChange}></SegmentedControl>
                        <Menu width={260}>
                            <Menu.Target>
                                <Avatar color="initials" component="button" name={(profile && profile.fullname)? profile.fullname : "Anonymous"}/>
                                {/*<Button color="#BEBBB6" c="black" variant="subtle" h={45}>
                                    <Group>
                                        <Avatar color="initials" name={(profile && profile.fullname)? profile.fullname : "Anonymous"}/>
                                        {profile?.fullname}
                                        <CaretDownIcon size={14}/>
                                    </Group>
                                </Button>*/}
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item leftSection={<CheckSquareIcon/>} onClick={()=>{navigate("/providerdashboard")}}>Servicios Pendientes</Menu.Item>
                                <Menu.Item leftSection={<GearSixIcon/>}>Configuración de Cuenta</Menu.Item>
                                <Menu.Item leftSection={<SignOutIcon/>} onClick={handleLogout}>Cerrar Sesión</Menu.Item>
                            </Menu.Dropdown>

                        </Menu>

                    </Group>
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