import { useState, useEffect } from "react";
import { bugsApi } from "../services/api";
import { BugCard } from "../components/BugCard";
import { BugForm } from "../components/BugForm";
import { MetricCards } from "../components/MetricCards";
import { Box, Flex, Text, Button } from "@chakra-ui/react";

const FILTERS = [
  { label: "Todos", value: "" },
  { label: "Abertos", value: "open" },
  { label: "Em andamento", value: "in_progress" },
  { label: "Resolvidos", value: "resolved" },
  { label: "Fechados", value: "closed" },
];

export function Dashboard({ projectId, onSelectBug }) {
  const [bugs, setBugs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBugs();
  }, [filter, projectId]);

  const fetchBugs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.status = filter;
      if (projectId) params.project_id = projectId;

      const res = await bugsApi.getAll(params);
      setBugs(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    await bugsApi.create(data);
    setShowForm(false);
    fetchBugs();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este bug?")) return;
    await bugsApi.remove(id);
    fetchBugs();
  };

  const handleStatusChange = async (id, status) => {
    await bugsApi.update(id, { status });
    fetchBugs();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="5">
        <Text as="h1" fontSize="xl" fontWeight="medium" color="gray.900" _dark={{ color: "white" }}>
          {projectId ? "Bugs do Projeto" : "Dashboard"}
        </Text>
        <Box
          as="button"
          fontSize="sm"
          px="4"
          py="1.5"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          _dark={{ borderColor: "gray.600", bg: "gray.700", color: "white", _hover: { bg: "gray.600" } }}
          bg="white"
          fontWeight="medium"
          cursor="pointer"
          onClick={() => setShowForm((v) => !v)}
          _hover={{ bg: "gray.50" }}
          transition="all 0.2s"
        >
          {showForm ? "Cancelar" : "+ Novo Bug"}
        </Box>
      </Flex>

      <MetricCards meta={meta} />

      {showForm && (
        <BugForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Flex gap="1.5" mb="4" flexWrap="wrap">
        {FILTERS.map((f) => {
          const isActive = filter === f.value;
          return (
            <Box
              as="button"
              key={f.value}
              fontSize="xs"
              px="3"
              py="1"
              borderRadius="full"
              border="1px solid"
              borderColor={isActive ? "gray.400" : "gray.200"}
              bg={isActive ? "gray.200" : "white"}
              color={isActive ? "gray.900" : "gray.600"}
              fontWeight={isActive ? "medium" : "normal"}
              cursor="pointer"
              _dark={{
                bg: isActive ? "gray.600" : "gray.800",
                borderColor: isActive ? "gray.500" : "gray.700",
                color: isActive ? "white" : "gray.400",
                _hover: { bg: isActive ? "gray.500" : "gray.700" }
              }}
              _hover={{ bg: isActive ? "gray.300" : "gray.50" }}
              onClick={() => setFilter(f.value)}
              transition="all 0.2s"
            >
              {f.label}
            </Box>
          );
        })}
      </Flex>

      {loading ? (
        <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm">Carregando bugs...</Text>
      ) : bugs.length === 0 ? (
        <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm">Nenhum bug encontrado.</Text>
      ) : (
        <Flex direction="column" gap="2.5">
          {bugs.map((bug) => (
            <BugCard
              key={bug.id}
              bug={bug}
              onClick={onSelectBug}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
}