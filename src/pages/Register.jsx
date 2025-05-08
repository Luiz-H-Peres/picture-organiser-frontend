import { useCallback, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { fetchRegistration } from "../services/api";
import { Message } from "../components/Message";
import { useNavigate } from "react-router-dom";

function Register() {

    const [error, setError] = useState({
        username: "",
        email: "",
        password: "",
        message: "",
    });

    const navigate = useNavigate();

    const handleRegister = useCallback(async () => {
        const username = document.getElementById("regUsername").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
      
        if(!username || !email || !password) {
            setError({
                username: !username ? "Username is required" : "",
                email: !email ? "Email is required" : "",
                password: !password ? "Password is required" : "",
            });
            return;
        } else {
            setError({
                username: "",
                email: "",
                password: "",
            });
        }

        const response = await fetchRegistration({ username, email, password }).catch((error) => {           
            setError({
                ...error,
                message: error.message,
            });
        });

        if(response.userId) {
            navigate("/login");
        }

    }, [navigate]);

  return (
    <div className="max-w-sm mx-auto pt-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Create an Account</h2>

        <Message message={error.message} variations="error" />
        
        <Input id="regUsername" label="Username" validationError={error.username} />
        <Input id="regEmail" type="email" label="Email" validationError={error.email} />
        <Input id="regPassword" type="password" label="Password" validationError={error.password} />

        <Button onClick={handleRegister} title="Register" className="w-full" />
        <Button href="/login" title="Already have an account? Login" variations="outline" className="w-full" />
  </div>
  )
}

export default Register;