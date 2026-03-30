import { useState, useEffect } from "react";
import { projectsApi, usersApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Box, Flex, Text, Grid } from "@chakra-ui/react";

const EMPTY = {
  title: "", description: "", severity: "low",
  status: "open", project_id: "", reporter_id: "", assignee_id: "",
};

export function BugForm({ onSubmit, onCancel, initialData = {} }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...EMPTY,
                                    reporter_id: user?.id ?? "",
                                    ...initialData,
                                  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    projectsApi.getAll().then(setProjects);
    usersApi.getAll().then(setUsers);
  }, []);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())  e.title      = "Título é obrigatório";
    if (!form.project_id)    e.project_id = "Selecione um projeto";
    if (!form.reporter_id)   e.reporter_id = "Selecione o reporter";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    w: "100%", fontSize: "sm", px: "3", py: "2", borderRadius: "md",
    border: "1px solid", borderColor: "gray.300", bg: "white", color: "gray.900",
    _dark: { borderColor: "gray.600", bg: "gray.700", color: "white" },
    _focus: { outline: "none", borderColor: "blue.500" }
  };

  return (
    <Flex
      bg="blackAlpha.500"
      _dark={{ bg: "blackAlpha.700" }}
      borderRadius="xl"
      justify="center"
      p="5"
      mb="6"
    >
      <Box as="form" onSubmit={handleSubmit} bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }} borderRadius="xl" border="1px solid" borderColor="gray.200" p="6" w="100%" maxW="480px" boxShadow="md">
        <Text as="h2" fontSize="lg" fontWeight="medium" mb="5" color="gray.900" _dark={{ color: "white" }}>
          {initialData.id ? "Editar Bug" : "Novo Bug"}
        </Text>

        {errors.general && (
          <Box bg="red.50" color="red.700" _dark={{ bg: "red.900", color: "red.200" }} fontSize="sm" p="2.5" px="3" borderRadius="md" mb="4">
            {errors.general}
          </Box>
        )}

        <Field label="Título *" error={errors.title}>
          <Box as="input" {...inputStyles} value={form.title} onChange={set("title")} placeholder="Ex: Botão não responde no Safari" />
        </Field>

        <Field label="Descrição">
          <Box as="textarea" {...inputStyles} minH="80px" resize="vertical" value={form.description} onChange={set("description")} placeholder="Comportamento esperado vs atual..." />
        </Field>

        <Grid templateColumns="1fr 1fr" gap="4">
          <Field label="Projeto *" error={errors.project_id}>
            <Box as="select" {...inputStyles} value={form.project_id} onChange={set("project_id")}>
              <option value="">Selecione...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Box>
          </Field>

          <Field label="Severidade">
            <Box as="select" {...inputStyles} value={form.severity} onChange={set("severity")}>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </Box>
          </Field>
        </Grid>

        <Grid templateColumns="1fr 1fr" gap="4">
          <Field label="Status">
            <Box as="select" {...inputStyles} value={form.status} onChange={set("status")}>
              <option value="open">Aberto</option>
              <option value="in_progress">Em andamento</option>
              <option value="resolved">Resolvido</option>
              <option value="closed">Fechado</option>
            </Box>
          </Field>

          <Field label="Reportado por" error={errors.reporter_id}>
            <Box as="input" {...inputStyles} bg="gray.100" color="gray.600" _dark={{ bg: "gray.600", color: "gray.300" }} value={user?.name ?? ""} disabled />
          </Field>
        </Grid>

        <Field label="Atribuído a">
          <Box as="select" {...inputStyles} value={form.assignee_id} onChange={set("assignee_id")}>
            <option value="">Nenhum</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </Box>
        </Field>

        <Flex justify="flex-end" gap="2" mt="6">
          <Box as="button" type="button" onClick={onCancel} fontSize="sm" px="4" py="1.5" borderRadius="md" border="1px solid" borderColor="gray.300" bg="transparent" cursor="pointer" _dark={{ borderColor: "gray.600", color: "gray.300", _hover: { bg: "whiteAlpha.200" } }} _hover={{ bg: "gray.50" }} transition="all 0.2s">
            Cancelar
          </Box>
          <Box as="button" type="submit" disabled={loading} fontSize="sm" px="4" py="1.5" borderRadius="md" border="1px solid" borderColor="blue.200" bg="blue.50" color="blue.700" fontWeight="medium" cursor="pointer" _dark={{ borderColor: "blue.500", bg: "blue.600", color: "white", _hover: { bg: "blue.500" } }} _hover={{ bg: "blue.100" }} transition="all 0.2s">
            {loading ? "Salvando..." : initialData.id ? "Salvar" : "Criar Bug"}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}

function Field({ label, error, children }) {
  return (
    <Box mb="4">
      <Text as="label" fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }} display="block" mb="1.5">
        {label}
      </Text>
      {children}
      {error && <Text fontSize="xs" color="red.600" _dark={{ color: "red.300" }} mt="1">{error}</Text>}
    </Box>
  );
}