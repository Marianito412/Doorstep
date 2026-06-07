import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Login from "./pages/Login.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import Catalogue from "./pages/Catalogue.tsx";
import ServicePage from "./pages/ServicePage.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthProvider><Catalogue/></AuthProvider>
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
