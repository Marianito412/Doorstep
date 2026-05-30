import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SupabaseTest from "./components/SupabaseTest.tsx";
import Login from "./pages/Login.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <SupabaseTest/>
  },
  {
    path: '/login',
    element: <Login/>
  }
]);

export function Router() {
  return <RouterProvider router={router}/>;
}
