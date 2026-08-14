import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./routes/home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
