import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";

const Home = lazy(() => import('./pages/Home'));
const Albums = lazy(() => import('./pages/Albums'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const routes = [
    {
        path: '/',
        element: (
			<App isPublicPage={true}>
				<Home />
			</App>
		)
    },
	{
		path: '/login',
		element: (
			<App isPublicPage={true}>
				<Login />
			</App>
		)
	},
	{
		path: '/register',
		element: (
			<App isPublicPage={true}>
				<Register />
			</App>
		)
	},
	{
        path: '/albums',
        element: (
			<App>
				<Albums />
			</App>
		)
    }
];

export const router = createBrowserRouter(routes);