import { useState } from "react";
import { commentsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Box, Flex, Text, Textarea, Button } from "@chakra-ui/react";

export function CommentSection({ bugId, comments, onCommentAdded }) {
    const { user } = useAuth();
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!body.trim()) return;
        setLoading(true);
        try {
            const comment = await commentsApi.create(bugId, {
                body,
                user_id: user.id,   // vem da sessão automaticamente
            });
            onCommentAdded(comment);
            setBody("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box mt="6">
            <Text as="h3" fontSize="md" fontWeight="medium" mb="3" color="gray.900" _dark={{ color: "white" }}>
                Comentários ({comments.length})
            </Text>

            <Flex direction="column" gap="3" mb="4">
                {comments.length === 0 && (
                    <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
                        Nenhum comentário ainda.
                    </Text>
                )}
                {comments.map((c) => (
                    <Box key={c.id} bg="gray.50" _dark={{ bg: "gray.700", borderColor: "gray.600" }} border="1px solid" borderColor="gray.200" borderRadius="md" p="3">
                        <Flex justify="space-between" mb="1.5">
                            <Text fontSize="sm" fontWeight="medium" color="gray.900" _dark={{ color: "gray.100" }}>
                                {c.user.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                                {new Date(c.created_at).toLocaleString("pt-BR")}
                            </Text>
                        </Flex>
                        <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }} lineHeight="1.5">
                            {c.body}
                        </Text>
                    </Box>
                ))}
            </Flex>

            <Box as="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap="2">
                <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Escreva um comentário..."
                    rows={3}
                    fontSize="sm"
                    bg="white" _dark={{ bg: "gray.800", borderColor: "gray.600", color: "white" }}
                    borderColor="gray.300"
                    _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                    borderRadius="md"
                />
                <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} textAlign="right">
                    {body.length} caracteres
                </Text>
                <Flex gap="2" align="flex-end">
                    <Button type="submit" isLoading={loading} size="sm" bg="gray.100" color="gray.800" _dark={{ bg: "whiteAlpha.200", color: "white", _hover: { bg: "whiteAlpha.300" } }} _hover={{ bg: "gray.200" }}>
                        Comentar
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
}