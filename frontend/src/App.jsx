import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { BugDetail } from "./pages/BugDetail";
import { Projects } from "./pages/Projects";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useTheme } from "next-themes";

function AppInner() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [selectedBug, setSelectedBug] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [fromPage, setFromPage] = useState(null);
  
  const { theme, setTheme } = useTheme();
  const toggleColorMode = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  if (!user) return <AuthPage />;

  const goToBug = (bug) => {
    setSelectedBug(bug);
    setFromPage(page);
    if (page === "dashboard") setSelectedProject(bug.project);
    setPage("bug-detail");
  };

  const goBack = () => {
    setSelectedBug(null);
    if (fromPage === "dashboard") {
      setSelectedProject(null);
      setPage("dashboard");
    } else if (fromPage === "project-dashboard" || selectedProject) {
      setPage("project-dashboard");
    } else {
      setPage("dashboard");
    }
  };

  const goToProjectDashboard = (project) => {
    setSelectedProject(project);
    setPage("project-dashboard");
  };

  const navTo = (p) => {
    setPage(p);
    if (p === "dashboard" || p === "projects") {
      setSelectedProject(null);
      setSelectedBug(null);
    }
  };

  const NavItem = ({ active, children, onClick, pl = "14px" }) => (
    <Box
      as="button"
      fontSize="sm"
      px="14px"
      pl={pl}
      py="10px"
      borderRadius="md"
      border="none"
      cursor="pointer"
      textAlign="left"
      fontWeight={active ? "semibold" : "medium"}
      color={active ? "blue.600" : "gray.600"}
      bg={active ? "blue.50" : "transparent"}
      _hover={{ bg: active ? "blue.100" : "gray.100" }}
      _dark={{
        color: active ? "blue.200" : "gray.400",
        bg: active ? "whiteAlpha.200" : "transparent",
        _hover: { bg: active ? "whiteAlpha.300" : "whiteAlpha.100" }
      }}
      onClick={onClick}
      w="100%"
      transition="all 0.2s"
    >
      {children}
    </Box>
  );

  return (
    <Flex h="100vh" bg="#F4F5F7" _dark={{ bg: "gray.900" }} fontFamily="Inter, system-ui, sans-serif">
      <Flex
        w="220px"
        bg="white"
        _dark={{ bg: "gray.800", borderColor: "gray.700" }}
        borderRight="1px solid"
        borderColor="gray.200"
        p="6"
        px="4"
        direction="column"
        gap="2"
        flexShrink="0"
        h="100vh"
        position="sticky"
        top="0"
        overflowY="auto"
      >
        <Box fontWeight="bold" fontSize="md" px="2" pb="6" color="gray.900" _dark={{ color: "white" }} display="flex" alignItems="center" gap="2">
          <Text fontSize="xl">🐞</Text> Bug Tracker
        </Box>
        
        <Flex direction="column" gap="1.5" flex="1" overflowY="auto">
          <NavItem active={page === "dashboard"} onClick={() => navTo("dashboard")}>
            Dashboard Geral
          </NavItem>
          <NavItem active={page === "projects"} onClick={() => navTo("projects")}>
            Projetos
          </NavItem>
          
          {(page === "project-dashboard" || (page === "bug-detail" && selectedProject)) && (
            <NavItem active={page === "project-dashboard"} onClick={() => setPage("project-dashboard")}>
              ↳ {selectedProject.name}
            </NavItem>
          )}
          
          {page === "bug-detail" && selectedBug && (
            <NavItem active={true} pl="20px">
              ↳ {selectedBug.title.length > 20 ? selectedBug.title.slice(0, 20) + "..." : selectedBug.title}
            </NavItem>
          )}
        </Flex>

        <Box my="4">
          <Box
            as="button"
            w="100%"
            py="2"
            px="3"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            _dark={{ borderColor: "gray.600", bg: "gray.700", color: "white", _hover: { bg: "gray.600" } }}
            bg="gray.100"
            color="gray.800"
            fontSize="sm"
            fontWeight="bold"
            cursor="pointer"
            onClick={toggleColorMode}
            _hover={{ bg: "gray.200" }}
            transition="all 0.2s"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="2"
            boxShadow="sm"
          >
            {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </Box>
        </Box>

        {/* Usuário logado + logout */}
        <Flex
          borderTop="1px solid"
          borderColor="gray.200"
          _dark={{ borderColor: "gray.700" }}
          pt="3"
          mt="2"
          align="center"
          justify="space-between"
          gap="2"
        >
          <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }} fontWeight="medium">
            👤 {user.name}
          </Text>
          <Box
            as="button"
            fontSize="xs"
            py="1"
            px="2"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.600", color: "gray.300", _hover: { bg: "whiteAlpha.200" } }}
            bg="transparent"
            color="gray.600"
            cursor="pointer"
            textAlign="center"
            _hover={{ bg: "gray.100" }}
            onClick={logout}
          >
            Sair
          </Box>
        </Flex>
      </Flex>

      <Flex flex="1" justify="center" overflowY="auto">
        <Box flex="1" p="8" maxW="960px" w="100%">
          {page === "dashboard" && <Dashboard onSelectBug={goToBug} />}
          {page === "projects" && <Projects onSelectProject={goToProjectDashboard} />}
          {page === "project-dashboard" && (
            <Dashboard projectId={selectedProject?.id} onSelectBug={goToBug} />
          )}
          {page === "bug-detail" && <BugDetail bugId={selectedBug?.id} onBack={goBack} />}
        </Box>
      </Flex>
    </Flex>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}