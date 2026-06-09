import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { theme } from './theme';
import './index.css'
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import {Notifications} from "@mantine/notifications";

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <Notifications/>
            <Router/>
        </MantineProvider>
    );
}
