import { useState, useEffect } from "react";
import { projectsApi } from "../services/api";
import { ProjectForm } from "../components/ProjectForm";
import { Box, Flex, Text, Grid } from "@chakra-ui/react";

export function Projects({ onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data) => {
    if (data.id) {
      await projectsApi.update(data.id, data);
    } else {
      await projectsApi.create(data);
    }
    closeForm();
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Certeza que deseja excluir este projeto? Todos os bugs vinculados serão perdidos (dependendo do banco de dados).")) return;
    await projectsApi.remove(id);
    fetchProjects();
  };

  const openEdit = (proj) => {
    setEditProject(proj);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditProject(null);
    setShowForm(false);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb="6">
        <Text as="h1" fontSize="2xl" fontWeight="semibold" color="gray.900" _dark={{ color: "white" }}>
          Projetos
        </Text>
        <Box
          as="button"
          fontSize="sm"
          px="4"
          py="2"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.300"
          _dark={{ borderColor: "gray.600", bg: "gray.700", color: "white", _hover: { bg: "gray.600" } }}
          bg="white"
          fontWeight="medium"
          cursor="pointer"
          onClick={() => setShowForm(!showForm)}
          _hover={{ bg: "gray.50" }}
          transition="all 0.2s"
          boxShadow="sm"
        >
          {showForm ? "Cancelar" : "+ Novo Projeto"}
        </Box>
      </Flex>

      {showForm && (
        <ProjectForm
          initialData={editProject || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={closeForm}
        />
      )}

      {loading ? (
        <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm">Carregando projetos...</Text>
      ) : projects.length === 0 ? (
        <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm">Nenhum projeto cadastrado.</Text>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap="5">
          {projects.map((proj) => (
            <Flex
              key={proj.id}
              direction="column"
              gap="3"
              bg="white"
              _dark={{ bg: "gray.800", borderColor: "gray.700" }}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              p="5"
              cursor="pointer"
              boxShadow="sm"
              transition="transform 0.1s, box-shadow 0.1s"
              onClick={() => onSelectProject(proj)}
              _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
            >
              <Flex justify="space-between" align="flex-start">
                <Text fontSize="md" fontWeight="semibold" color="gray.900" _dark={{ color: "gray.100" }}>
                  {proj.name}
                </Text>
                <Box
                  fontSize="xs"
                  px="2"
                  py="0.5"
                  borderRadius="full"
                  fontWeight="medium"
                  bg={proj.status === "active" ? "green.100" : "gray.100"}
                  color={proj.status === "active" ? "green.800" : "gray.800"}
                  _dark={{
                    bg: proj.status === "active" ? "green.900" : "gray.700",
                    color: proj.status === "active" ? "green.200" : "gray.300",
                  }}
                >
                  {proj.status === "active" ? "Ativo" : "Arquivado"}
                </Box>
              </Flex>
              
              <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} lineHeight="1.5" flex="1">
                {proj.description || <Box as="span" color="gray.400" fontStyle="italic">Sem descrição</Box>}
              </Text>
              
              <Box fontSize="xs" color="gray.500" _dark={{ color: "gray.500", borderColor: "gray.700" }} mt="1" pb="3" borderBottom="1px solid" borderColor="gray.100">
                🐛 {proj.bugs_count || 0} bugs associados
              </Box>

              <Flex justify="space-between" align="center" pt="1" onClick={(e) => e.stopPropagation()}>
                <Box
                  as="button"
                  fontSize="sm"
                  px="3.5"
                  py="1.5"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="blue.200"
                  bg="blue.50"
                  color="blue.700"
                  fontWeight="medium"
                  cursor="pointer"
                  _dark={{ borderColor: "blue.500", bg: "blue.900", color: "blue.200", _hover: { bg: "blue.800" } }}
                  _hover={{ bg: "blue.100" }}
                  transition="all 0.2s"
                  onClick={() => onSelectProject(proj)}
                >
                   Ver Bugs
                </Box>
                <Flex gap="2">
                   <Box
                     as="button"
                     fontSize="xs"
                     px="2.5"
                     py="1"
                     borderRadius="md"
                     border="1px solid"
                     borderColor="gray.200"
                     bg="white"
                     color="gray.600"
                     cursor="pointer"
                     _dark={{ borderColor: "gray.600", bg: "gray.700", color: "gray.300", _hover: { bg: "gray.600" } }}
                     _hover={{ bg: "gray.50" }}
                     onClick={() => openEdit(proj)}
                   >
                     Editar
                   </Box>
                   <Box
                     as="button"
                     fontSize="xs"
                     px="2.5"
                     py="1"
                     borderRadius="md"
                     border="1px solid"
                     borderColor="red.200"
                     bg="white"
                     color="red.600"
                     cursor="pointer"
                     _dark={{ borderColor: "red.800", bg: "transparent", color: "red.300", _hover: { bg: "whiteAlpha.100" } }}
                     _hover={{ bg: "red.50" }}
                     onClick={() => handleDelete(proj.id)}
                   >
                     Excluir
                   </Box>
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Grid>
      )}
    </Box>
  );
}
