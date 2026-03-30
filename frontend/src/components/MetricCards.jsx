import { Grid, Box, Text } from "@chakra-ui/react";

export function MetricCards({ meta }) {
    if (!meta) return null;

    const cards = [
        { label: "Total de bugs", value: meta.total, color: "#378ADD" },
        { label: "Abertos", value: meta.open, color: "#BA7517" },
        { label: "Em andamento", value: meta.in_progress, color: "#185FA5" },
        { label: "Resolvidos", value: meta.resolved, color: "#3B6D11" },
    ];

    return (
        <Grid templateColumns="repeat(4, 1fr)" gap="10px" mb="6">
            {cards.map((card) => (
                <Box 
                    key={card.label} 
                    bg="white" 
                    _dark={{ bg: "gray.800", borderColor: "gray.700" }} 
                    border="1px solid" 
                    borderColor="transparent"
                    borderRadius="md" 
                    p="4"
                    boxShadow="sm"
                >
                    <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }} mb="1.5">
                        {card.label}
                    </Text>
                    <Text fontSize="2xl" fontWeight="medium" color={card.color} _dark={{ color: card.color }}>
                        {card.value}
                    </Text>
                </Box>
            ))}
        </Grid>
    );
}