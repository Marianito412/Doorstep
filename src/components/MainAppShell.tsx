import {AppShell, Burger, Group, UnstyledButton} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import type {ReactNode} from "react";


function MainAppShell({children}: {children: ReactNode}) {
    const [opened, { toggle }] = useDisclosure();
    
    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        Header
                        <Group ml="xl" gap={0} visibleFrom="sm">
                            <UnstyledButton >Home</UnstyledButton>
                            <UnstyledButton >Blog</UnstyledButton>
                            <UnstyledButton >Contacts</UnstyledButton>
                            <UnstyledButton >Support</UnstyledButton>
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                <UnstyledButton >Home</UnstyledButton>
                <UnstyledButton >Blog</UnstyledButton>
                <UnstyledButton >Contacts</UnstyledButton>
                <UnstyledButton >Support</UnstyledButton>
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    )
}

export default MainAppShell