import {AppShell, Burger, Group, NavLink, SegmentedControl, Title} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {DoorOpenIcon} from '@phosphor-icons/react';
import type {ReactNode} from "react";
import {useNavigate, useLocation} from "react-router-dom";

const links = [
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
    {
        value: '/support',
        label: (
            <Title order={3}>Support</Title>
        ),
    }
]
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
                        <Title><DoorOpenIcon weight="duotone"/>Doorstep</Title>
                    </Group>
                    
                    <Group ml="10" visibleFrom="sm">
                        <Title><DoorOpenIcon weight="duotone"/>Doorstep</Title>
                    </Group>
                    
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