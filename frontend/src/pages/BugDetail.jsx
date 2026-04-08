// src/pages/BugDetail.jsx
import { useState, useEffect } from "react";
import { bugsApi } from "../services/api";
import { CommentSection } from "../components/CommentSection";
import { Box, Flex, Text, Button, Badge, Grid } from "@chakra-ui/react";

const SEVERITY_STYLE = {
    low: { colorScheme: "green" },
    medium: { colorScheme: "blue" },
    high: { colorScheme: "orange" },
    critical: { colorScheme: "red" },
};

export function BugDetail({ bugId, onBack }) {
    const [bug, setBug] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bugsApi.getOne(bugId).then((data) => {
            setBug(data);
            setLoading(false);
        });
    }, [bugId]);

    const handleCommentAdded = (comment) => {
        setBug((prev) => ({
            ...prev,
            comments: [...prev.comments, comment],
        }));
    };

    if (loading) return <Text color="gray.500" _dark={{ color: "gray.400" }}>Carregando...</Text>;
    if (!bug) return <Text color="gray.500" _dark={{ color: "gray.400" }}>Bug não encontrado.</Text>;

    return (
        <Box w="100%">
            <Button 
                onClick={onBack} 
                size="sm" 
                variant="outline" 
                mb="4" 
                borderColor="gray.300" 
                _dark={{ borderColor: "gray.600", color: "gray.200", _hover: { bg: "whiteAlpha.200" } }} 
                _hover={{ bg: "gray.50" }}
            >
                ← Voltar
            </Button>

            <Box bg="white" _dark={{ bg: "gray.800", borderColor: "gray.700" }} border="1px solid" borderColor="gray.200" borderRadius="xl" p="5" mb="6" boxShadow="sm">
                <Flex justify="space-between" align="flex-start" mb="4">
                    <Text fontSize="lg" fontWeight="medium" lineHeight="1.4" color="gray.900" _dark={{ color: "white" }}>
                        {bug.title}
                    </Text>
                    <Badge colorScheme={SEVERITY_STYLE[bug.severity]?.colorScheme || "gray"} borderRadius="full" px="3" py="0.5" textTransform="lowercase">
                        {bug.severity}
                    </Badge>
                </Flex>

                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="4" mb="4">
                    <MetaItem label="Projeto" value={bug.project?.name} />
                    <MetaItem label="Status" value={bug.status.replace("_", " ")} />
                    <MetaItem label="Reporter" value={bug.reporter?.name} />
                    <MetaItem label="Responsável" value={bug.assignee?.name ?? "—"} />
                    <MetaItem
                        label="Criado em"
                        value={new Date(bug.created_at).toLocaleDateString("pt-BR")}
                    />
                </Grid>

                {bug.description && (
                    <Box borderTop="1px solid" borderColor="gray.100" _dark={{ borderColor: "gray.700" }} pt="4">
                        <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} mb="1.5">Descrição</Text>
                        <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }} lineHeight="1.6">
                            {bug.description}
                        </Text>
                    </Box>
                )}
            </Box>

            <CommentSection
                bugId={bug.id}
                comments={bug.comments ?? []}
                onCommentAdded={handleCommentAdded}
            />
        </Box>
    );
}

function MetaItem({ label, value }) {
    return (
        <Flex direction="column" gap="0.5">
            <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>{label}</Text>
            <Text fontSize="sm" fontWeight="medium" color="gray.900" _dark={{ color: "gray.100" }}>{value}</Text>
        </Flex>
    );
}