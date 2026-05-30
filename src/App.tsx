import '@mantine/core/styles.css';
import { theme } from './theme';
import './index.css'
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import {AuthProvider} from "./context/AuthContext.tsx";

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <AuthProvider>
            <Router/>
            </AuthProvider>
        </MantineProvider>
    );
}
