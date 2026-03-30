import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const EMPTY = { name: "", description: "", status: "active" };

export function ProjectForm({ onSubmit, onCancel, initialData = {} }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialData });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

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
          {initialData.id ? "Editar Projeto" : "Novo Projeto"}
        </Text>

        {errors.general && (
          <Box bg="red.50" color="red.700" _dark={{ bg: "red.900", color: "red.200" }} fontSize="sm" p="2.5" px="3" borderRadius="md" mb="4">
            {errors.general}
          </Box>
        )}

        <Field label="Nome *" error={errors.name}>
          <Box as="input" {...inputStyles} value={form.name} onChange={set("name")} placeholder="Ex: Refatoração do App" />
        </Field>

        <Field label="Descrição">
          <Box as="textarea" {...inputStyles} minH="80px" resize="vertical" value={form.description} onChange={set("description")} placeholder="Objetivos do projeto..." />
        </Field>

        <Field label="Status">
          <Box as="select" {...inputStyles} value={form.status} onChange={set("status")}>
            <option value="active">Ativo</option>
            <option value="archived">Arquivado</option>
          </Box>
        </Field>

        <Flex justify="flex-end" gap="2" mt="6">
          <Box as="button" type="button" onClick={onCancel} fontSize="sm" px="4" py="1.5" borderRadius="md" border="1px solid" borderColor="gray.300" bg="transparent" cursor="pointer" _dark={{ borderColor: "gray.600", color: "gray.300", _hover: { bg: "whiteAlpha.200" } }} _hover={{ bg: "gray.50" }} transition="all 0.2s">
            Cancelar
          </Box>
          <Box as="button" type="submit" disabled={loading} fontSize="sm" px="4" py="1.5" borderRadius="md" border="1px solid" borderColor="blue.200" bg="blue.50" color="blue.700" fontWeight="medium" cursor="pointer" _dark={{ borderColor: "blue.500", bg: "blue.600", color: "white", _hover: { bg: "blue.500" } }} _hover={{ bg: "blue.100" }} transition="all 0.2s">
            {loading ? "Salvando..." : initialData.id ? "Salvar" : "Criar Projeto"}
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
