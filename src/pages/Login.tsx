import {Alert, Button, Card, PasswordInput, Stack, TextInput, Title} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useAuthContext} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

type LoginFormValues = {
    email: string
    password: string
}

function Login(){
    const { signIn } = useAuthContext()
    const navigate   = useNavigate()
    const [error, setError]     = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const form = useForm<LoginFormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email:    (val) => (/^\S+@\S+$/.test(val) ? null : 'Email inválido'),
            password: (val) => (val.length < 6 ? 'Mínimo 6 caracteres' : null),
        },
    })

    async function handleSubmit(values: LoginFormValues) {
        setError(null)
        setLoading(true)
        try {
            await signIn(values)
            navigate('/')
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Error al iniciar sesión'
            setError(message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <Stack align="center" justify="center" gap="md">
            {error && (
                <Alert color="red" title="Error">
                    {error}
                </Alert>
            )}
            <Title>Doorstep</Title>
            <Card w="350">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput {...form.getInputProps('email')} label="Email" placeholder="you@mantine.dev" required radius="md"/>
                    <PasswordInput {...form.getInputProps('password')} label="Password" placeholder="Your password" required mt="md" radius="md"/>
                    
                    <Button type="submit" mt="md" fullWidth radius="md" loading={loading}>
                        Sign in
                    </Button>
                </form>
            </Card>
        </Stack>
    )
}

export default Login;