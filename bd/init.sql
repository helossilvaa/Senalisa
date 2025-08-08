-- Criação da tabela `usuarios`
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    funcao VARCHAR(100) NOT NULL,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criação da tabela `pool`
CREATE TABLE pool (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo ENUM(
        'externo',
        'manutencao',
        'apoio_tecnico',
        'limpeza'
    ) NOT NULL,
    descricao TEXT,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES usuarios (id),
    FOREIGN KEY (updated_by) REFERENCES usuarios (id)
);

-- Criação da tabela 'Salas'
CREATE TABLE salas {
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_sala INT NOT NULL
}

-- Criação da tabela `chamados`
CREATE TABLE chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    tipo_id INT,
    tecnico_id INT,
    usuario_id INT,
    sala_id INT
    status ENUM(
        'pendente',
        'em andamento',
        'concluído'
    ) DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_id) REFERENCES pool (id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    FOREIGN KEY (sala_id) REFERENCES salas (id)
);

-- Criação da tabela `relatorio`
CREATE TABLE relatorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT,
    tecnico_id INT,
    descricao TEXT,
    comeco TIMESTAMP NOT NULL,
    fim TIMESTAMP NOT NULL,
    duracao INT AS (
        TIMESTAMPDIFF(SECOND, comeco, fim)
    ) STORED, -- Calcula a duração em segundos
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados (id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios (id)
);

-- Criação da tabela `pool_tecnico`
CREATE TABLE pool_tecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pool INT,
    tecnico_id INT,
    FOREIGN KEY (id_pool) REFERENCES pool (id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios (id)
);

-- Criação da tabela de 'thread' para apontamentos extras

CREATE TABLE apontamentos_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chamado_id INT NOT NULL,
  usuario_id INT NOT NULL,
  apontamento TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chamado_id) REFERENCES chamados (id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

CREATE TABLE apontamentos_tecnico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chamado_id INT NOT NULL,
  tecnico_id INT NOT NULL,
  apontamento TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chamado_id) REFERENCES chamados (id),
  FOREIGN KEY (tecnico_id) REFERENCES usuarios (id)
);

-- Para criar avaliações
CREATE TABLE avaliacoes {
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    chamado_id INT NOT NULL,
    tecnico_id INT NOT NULL,
    comentario TEXT NOT NULL,
    pontuacao INT NOT NULL,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamada_id) REFERENCES chamados (id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios (id),
    FOREIGN KEY (usuarios_id) REFERENCES usuarios (id)
}

-- Para as 'notificações'
CREATE TABLE notificacoes (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    usuario_id INT NOT NULL,
    tecnico_id INT NOT NULL,
    mensagem TEXT NOT NULL,
    visualizado tinyint(1) DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios (id),
)



-- Índices adicionais para otimização
CREATE INDEX idx_usuarios_email ON usuarios (email);

CREATE INDEX idx_chamados_status ON chamados (status);

CREATE INDEX idx_relatorios_comeco_fim ON relatorios (comeco, fim);