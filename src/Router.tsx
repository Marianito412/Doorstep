import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SupabaseTest from "./components/SupabaseTest.tsx";
import Login from "./pages/Login.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import Catalogue from "./pages/Catalogue.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthProvider><Catalogue/></AuthProvider>
    },
    {
        path: '/',
        element: <AuthProvider><SupabaseTest/></AuthProvider>
    },
    {
        path: '/login',
        element: <AuthProvider><Login/></AuthProvider>
    }
]);

export function Router() {
    return <RouterProvider router={router}/>;
}
