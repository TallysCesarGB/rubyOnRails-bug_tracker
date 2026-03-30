import { Box, Flex, Text } from "@chakra-ui/react";

const SEVERITY_STYLE = {
  low: { light: { bg: "#EAF3DE", color: "#27500A" }, dark: { bg: "rgba(39, 80, 10, 0.4)", color: "#EAF3DE" } },
  medium: { light: { bg: "#E6F1FB", color: "#0C447C" }, dark: { bg: "rgba(12, 68, 124, 0.4)", color: "#E6F1FB" } },
  high: { light: { bg: "#FAEEDA", color: "#633806" }, dark: { bg: "rgba(99, 56, 6, 0.4)", color: "#FAEEDA" } },
  critical: { light: { bg: "#FCEBEB", color: "#A32D2D" }, dark: { bg: "rgba(163, 45, 45, 0.4)", color: "#FCEBEB" } },
};

const STATUS_STYLE = {
  open: { light: { bg: "#FAEEDA", color: "#633806" }, dark: { bg: "rgba(99, 56, 6, 0.4)", color: "#FAEEDA" } },
  in_progress: { light: { bg: "#E6F1FB", color: "#0C447C" }, dark: { bg: "rgba(12, 68, 124, 0.4)", color: "#E6F1FB" } },
  resolved: { light: { bg: "#EAF3DE", color: "#27500A" }, dark: { bg: "rgba(39, 80, 10, 0.4)", color: "#EAF3DE" } },
  closed: { light: { bg: "#F1EFE8", color: "#444441" }, dark: { bg: "rgba(68, 68, 65, 0.4)", color: "#F1EFE8" } },
};

const STATUS_LABEL = {
  open: "aberto", in_progress: "em andamento",
  resolved: "resolvido", closed: "fechado",
};

const SEVERITY_LABEL = {
  low: "baixa", medium: "média",
  high: "alta", critical: "crítico",
};

export function BugCard({ bug, onClick, onStatusChange, onDelete }) {
  return (
    <Flex
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p="4"
      cursor="pointer"
      direction="column"
      gap="2.5"
      transition="border-color .15s"
      _hover={{ borderColor: "gray.300", _dark: { borderColor: "gray.500" } }}
    >
      <Flex direction="column" gap="2.5" flex="1" onClick={() => onClick(bug)}>
        <Flex justify="space-between" align="flex-start" gap="2.5">
          <Text fontSize="sm" fontWeight="medium" lineHeight="1.4" color="gray.900" _dark={{ color: "gray.100" }}>
            {bug.title}
          </Text>
          <Flex gap="1.5" flexShrink="0">
            <Box
              fontSize="xs"
              px="2"
              py="0.5"
              borderRadius="full"
              whiteSpace="nowrap"
              bg={SEVERITY_STYLE[bug.severity].light.bg}
              color={SEVERITY_STYLE[bug.severity].light.color}
              _dark={{ bg: SEVERITY_STYLE[bug.severity].dark.bg, color: SEVERITY_STYLE[bug.severity].dark.color }}
            >
              {SEVERITY_LABEL[bug.severity]}
            </Box>
            <Box
              fontSize="xs"
              px="2"
              py="0.5"
              borderRadius="full"
              whiteSpace="nowrap"
              bg={STATUS_STYLE[bug.status].light.bg}
              color={STATUS_STYLE[bug.status].light.color}
              _dark={{ bg: STATUS_STYLE[bug.status].dark.bg, color: STATUS_STYLE[bug.status].dark.color }}
            >
              {STATUS_LABEL[bug.status]}
            </Box>
          </Flex>
        </Flex>

        {bug.description && (
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} lineHeight="1.5">
            {bug.description.length > 100
              ? bug.description.slice(0, 100) + "..."
              : bug.description}
          </Text>
        )}

        <Flex gap="3.5" fontSize="xs" color="gray.500" _dark={{ color: "gray.500" }}>
          <Text>📁 {bug.project?.name}</Text>
          <Text>👤 {bug.reporter?.name}</Text>
          {bug.assignee && <Text>🔧 {bug.assignee.name}</Text>}
        </Flex>
      </Flex>

      <Flex gap="2" align="center" onClick={(e) => e.stopPropagation()}>
        <Box
          as="select"
          value={bug.status}
          onChange={(e) => onStatusChange(bug.id, e.target.value)}
          fontSize="xs"
          px="2"
          py="1"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
          bg="transparent"
          color="gray.700"
          _dark={{ borderColor: "gray.600", color: "gray.300", bg: "gray.700" }}
        >
          <option value="open">Aberto</option>
          <option value="in_progress">Em andamento</option>
          <option value="resolved">Resolvido</option>
          <option value="closed">Fechado</option>
        </Box>

        <Box
          as="button"
          onClick={() => onDelete(bug.id)}
          fontSize="xs"
          px="2.5"
          py="1"
          borderRadius="md"
          border="1px solid"
          borderColor="red.200"
          bg="transparent"
          color="red.600"
          cursor="pointer"
          _dark={{ borderColor: "red.800", color: "red.300", _hover: { bg: "whiteAlpha.100" } }}
          _hover={{ bg: "red.50" }}
          transition="all 0.2s"
        >
          Excluir
        </Box>
      </Flex>
    </Flex>
  );
}