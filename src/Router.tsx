import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Login from "./pages/Login.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import Catalogue from "./pages/Catalogue.tsx";
import ServicePage from "./pages/ServicePage.tsx";
import ProviderDashboard from "./pages/ProviderDashboard.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthProvider><Catalogue/></AuthProvider>
    },
    {
        path: '/providerdashboard',
        element: <AuthProvider><ProviderDashboard/></AuthProvider>
    },
    {
        path: '/service',
        element: <AuthProvider><ServicePage/></AuthProvider>
    },
    {
        path: '/login',
        element: <AuthProvider><Login/></AuthProvider>
    }
]);

export function Router() {
    return <RouterProvider router={router}/>;
}
