import { useCallback, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Message } from "../components/Message";

function Login() {

    const [error, setError] = useState({
        email: "",
        password: "",
        message: "",
    });

    const { signin } = useAuth();

      const handleLogin = useCallback(() => {

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        if(!email || !password) {
            setError({
                email: !email ? "Email is required" : "",
                password: !password ? "Password is required" : "",
            });
            return;
        } else {
            setError({
                email: "",
                password: "",
            });
        }

        signin(email, password).catch(e => {
            setError({
                message: e.message
            });
        });
        
      }, [signin]);

    return (
      <div className="max-w-sm mx-auto pt-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Login</h2>

        <Message message={error.message} variations="error" />

        <Input id="loginEmail" type="email" label="Email" validationError={error['email']}  />
        <Input id="loginPassword" type="password" label="Password" validationError={error['password']} />
        <Button title="Login" onClick={handleLogin} className="w-full" />
        <Button title="Register" href="/register" variations="outline" className="w-full" />
      </div>
    )
}

export default Login;