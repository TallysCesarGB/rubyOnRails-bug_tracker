# db/seeds.rb
puts "Limpando banco..."
Comment.destroy_all
Bug.destroy_all
Project.destroy_all
User.destroy_all

# ─── Usuários ────────────────────────────────────────────────
puts "Criando usuários..."

joao  = User.create!(name: "João Silva",   email: "joao@bugtracker.com",  role: "developer")
maria = User.create!(name: "Maria Alves",  email: "maria@bugtracker.com", role: "developer")
pedro = User.create!(name: "Pedro Rocha",  email: "pedro@bugtracker.com", role: "tester")
ana   = User.create!(name: "Ana Costa",    email: "ana@bugtracker.com",   role: "manager")

# ─── Projetos ────────────────────────────────────────────────
puts "Criando projetos..."

portal = Project.create!(
  name:        "Portal Web",
  description: "Sistema web principal de atendimento ao cliente.",
  status:      "active"
)

api = Project.create!(
  name:        "API Core",
  description: "API REST central consumida por todos os clientes.",
  status:      "active"
)

mobile = Project.create!(
  name:        "Mobile App",
  description: "Aplicativo iOS e Android para usuários finais.",
  status:      "active"
)

# ─── Bugs ────────────────────────────────────────────────────
puts "Criando bugs..."

b1 = Bug.create!(
  title:       "Botão de login não responde no Safari 17",
  description: "Ao clicar em 'Entrar' no Safari 17.x, nada acontece. Console mostra erro de CORS. Funciona normalmente no Chrome e Firefox.",
  severity:    "critical",
  status:      "open",
  project:     portal,
  reporter:    pedro,
  assignee:    joao
)

b2 = Bug.create!(
  title:       "API de relatórios retorna 500 para datas futuras",
  description: "Endpoint GET /api/v1/reports?date=2025-12-01 retorna Internal Server Error. O problema está na query SQL que não trata datas além do mês atual.",
  severity:    "high",
  status:      "in_progress",
  project:     api,
  reporter:    pedro,
  assignee:    maria
)

b3 = Bug.create!(
  title:       "Paginação quebra ao filtrar por múltiplas tags",
  description: "Quando o usuário seleciona mais de uma tag no filtro e avança para a página 2, o sistema ignora os filtros e exibe todos os registros.",
  severity:    "medium",
  status:      "open",
  project:     portal,
  reporter:    joao,
  assignee:    nil
)

b4 = Bug.create!(
  title:       "Upload de avatar não aceita PNG com transparência",
  description: "Imagens PNG com canal alpha são rejeitadas com mensagem 'formato inválido'. JPEGs funcionam normalmente.",
  severity:    "low",
  status:      "resolved",
  project:     mobile,
  reporter:    ana,
  assignee:    joao
)

b5 = Bug.create!(
  title:       "Notificações push não chegam em dispositivos Android 14",
  description: "Após atualização do Android 14, as notificações push pararam de funcionar. iOS não é afetado. Possível problema com nova política de permissões.",
  severity:    "high",
  status:      "open",
  project:     mobile,
  reporter:    pedro,
  assignee:    maria
)

b6 = Bug.create!(
  title:       "Token JWT expira antes do tempo configurado",
  description: "O token expira em ~15 min mesmo com configuração de 1 hora. Suspeita de fuso horário incorreto no servidor de produção.",
  severity:    "critical",
  status:      "in_progress",
  project:     api,
  reporter:    joao,
  assignee:    maria
)

b7 = Bug.create!(
  title:       "Campo de busca não sanitiza caracteres especiais",
  description: "Pesquisar por 'João' (com cedilha/acento) retorna zero resultados. Caracteres especiais precisam de normalização antes da query.",
  severity:    "medium",
  status:      "open",
  project:     portal,
  reporter:    ana,
  assignee:    nil
)

b8 = Bug.create!(
  title:       "Tela de cadastro trava em conexões 3G",
  description: "Em redes lentas, o formulário de cadastro fica em estado de loading infinito após submit. Sem feedback de erro para o usuário.",
  severity:    "medium",
  status:      "closed",
  project:     mobile,
  reporter:    pedro,
  assignee:    joao
)

# ─── Comentários ─────────────────────────────────────────────
puts "Criando comentários..."

Comment.create!(bug: b1, user: joao,  body: "Reproduzi localmente. O problema é com o header Authorization sendo bloqueado pelo CORS. Vou abrir PR hoje.")
Comment.create!(bug: b1, user: pedro, body: "Confirmado em Safari 17.0 e 17.1. Em 16.x funciona normalmente.")
Comment.create!(bug: b1, user: ana,   body: "Prioridade máxima — esse bug está afetando o acesso de clientes em produção.")

Comment.create!(bug: b2, user: maria, body: "Identifiquei a query problemática em reports_service.rb linha 84. Corrigindo.")
Comment.create!(bug: b2, user: joao,  body: "Ao revisar, também encontrei um N+1 nessa query. Vou resolver junto.")

Comment.create!(bug: b3, user: joao,  body: "Consigo reproduzir. Parece que o scope de filtro é resetado ao trocar de página.")
Comment.create!(bug: b3, user: pedro, body: "Afeta todos os filtros combinados, não só tags.")

Comment.create!(bug: b4, user: joao,  body: "Corrigido! O validador de imagem só aceitava RGB. Adicionado suporte a RGBA.")
Comment.create!(bug: b4, user: ana,   body: "Testei com 5 imagens diferentes, todas funcionando. Fechando.")

Comment.create!(bug: b5, user: maria, body: "Analisando a documentação do Android 14. Parece que precisamos declarar POST_NOTIFICATIONS no manifest.")
Comment.create!(bug: b5, user: pedro, body: "Confirmado em Pixel 7 e Samsung Galaxy S23, ambos com Android 14.")

Comment.create!(bug: b6, user: maria, body: "O servidor estava com TZ=UTC mas a aplicação assumia America/Sao_Paulo. Corrigindo variável de ambiente.")
Comment.create!(bug: b6, user: joao,  body: "Bom achado! Isso explica vários outros problemas intermitentes de sessão que tínhamos.")

# ─── Resumo ──────────────────────────────────────────────────
puts "\n Seed concluído com sucesso!"
puts "  #{User.count} usuários"
puts "  #{Project.count} projetos"
puts "  #{Bug.count} bugs"
puts "    - críticos:     #{Bug.where(severity: 'critical').count}"
puts "    - abertos:      #{Bug.where(status: 'open').count}"
puts "    - em andamento: #{Bug.where(status: 'in_progress').count}"
puts "    - resolvidos:   #{Bug.where(status: 'resolved').count}"
puts "    - fechados:     #{Bug.where(status: 'closed').count}"
puts "  #{Comment.count} comentários"