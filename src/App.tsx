import '@mantine/core/styles.css';
import { theme } from './theme';
import './index.css'
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <Router/>
        </MantineProvider>
    );
}
