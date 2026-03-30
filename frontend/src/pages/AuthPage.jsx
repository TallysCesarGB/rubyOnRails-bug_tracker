import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usersApi } from "../services/api";
import { Box, Flex, Text, Button as ChakraButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";

const BASE_URL = "http://localhost:3000/api/v1";

export function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme, setTheme } = useTheme();
  const toggleColorMode = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const user = await usersApi.create({
          name: form.name,
          email: form.email,
          password: form.password,
          role: "member",
        });
        login(user);
      } else {
        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao fazer login");
        login(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" position="relative" bg="#F4F5F7" _dark={{ bg: "gray.900" }} align="center" justify="center" fontFamily="Inter, system-ui, sans-serif">
      <Box
        as="button"
        position="absolute"
        top="6"
        right="6"
        py="2"
        px="3"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.300"
        _dark={{ borderColor: "gray.600", bg: "gray.700", color: "white", _hover: { bg: "gray.600" } }}
        bg="white"
        color="gray.800"
        fontSize="sm"
        fontWeight="bold"
        cursor="pointer"
        onClick={toggleColorMode}
        _hover={{ bg: "gray.50" }}
        transition="all 0.2s"
        display="flex"
        alignItems="center"
        gap="2"
        boxShadow="sm"
      >
        {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
      </Box>

      <Box bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }} border="1px solid" borderColor="gray.200" borderRadius="2xl" p="9" w="100%" maxW="380px" boxShadow="sm">
        <Flex align="center" justify="center" gap="2" mb="6">
          <Text fontSize="2xl">🐞</Text>
          <Text fontSize="lg" fontWeight="bold" color="gray.900" _dark={{ color: "white" }}>Bug Tracker</Text>
        </Flex>

        <Text fontSize="md" fontWeight="semibold" color="gray.900" _dark={{ color: "gray.100" }} textAlign="center" mb="5">
          {mode === "login" ? "Entrar na conta" : "Criar conta"}
        </Text>

        {error && (
          <Box bg="red.50" color="red.600" _dark={{ bg: "red.900", color: "red.200" }} fontSize="sm" p="2" px="3" borderRadius="md" mb="3">
            {error}
          </Box>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          {mode === "register" && (
            <Field label="Nome">
              <input
                style={{ width: "100%", fontSize: "13px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", background: "inherit", color: "inherit" }}
                value={form.name}
                onChange={set("name")}
                placeholder="Seu nome"
                required
              />
            </Field>
          )}

          <Field label="Email">
            <input
              style={{ width: "100%", fontSize: "13px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", background: "inherit", color: "inherit" }}
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="seu@email.com"
              required
            />
          </Field>

          <Field label="Senha">
            <input
              style={{ width: "100%", fontSize: "13px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", background: "inherit", color: "inherit" }}
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              required
            />
          </Field>

          <Box as="button" mt="2" fontSize="sm" py="2.5" borderRadius="md" bg="blue.600" _dark={{ bg: "blue.500" }} color="white" fontWeight="semibold" cursor="pointer" w="100%" _hover={{ bg: "blue.700" }} transition="all 0.2s" disabled={loading}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </Box>
        </form>

        <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} textAlign="center" mt="4">
          {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <Box as="span" cursor="pointer" color="blue.600" _dark={{ color: "blue.400" }} fontWeight="semibold" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Cadastre-se" : "Entrar"}
          </Box>
        </Text>
      </Box>
    </Flex>
  );
}

function Field({ label, children }) {
  return (
    <Box mb="3.5">
      <Text as="label" fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }} display="block" mb="1">{label}</Text>
      <Box _dark={{ "& input": { borderColor: "gray.600" } }}>
        {children}
      </Box>
    </Box>
  );
}