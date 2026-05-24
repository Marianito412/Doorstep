import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SupabaseTest from "./components/SupabaseTest.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <SupabaseTest/>
  },
  {
    path: '/Employee',
    element: <></>
  },
  {
    path: '/Parent',
    element: <></>
  }
]);

export function Router() {
  return <RouterProvider router={router}/>;
}
