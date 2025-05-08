import { Layout } from "./components/Layout";
import { AuthProvider } from "./providers/AuthProvider";

export function App({ children, isPublicPage = false }) {
    return (
        <AuthProvider isPublicPage={isPublicPage}>
            <Layout>
                {children}
            </Layout>
        </AuthProvider>
    );
}