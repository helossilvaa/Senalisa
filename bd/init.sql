-- Tabela `usuarios`
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

-- Tabela `pool`
CREATE TABLE pool (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza') NOT NULL,
    descricao TEXT,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    FOREIGN KEY (created_by) REFERENCES usuarios(id),
    FOREIGN KEY (updated_by) REFERENCES usuarios(id)
);

-- Tabela `salas`
CREATE TABLE salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_sala VARCHAR(255) NOT NULL
);

-- Tabela `chamados`
CREATE TABLE chamados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    tipo_id INT,
    tecnico_id INT,
    usuario_id INT,
    sala_id INT NOT NULL,
    equipamento_id INT NOT NULL,
    status ENUM('pendente', 'em andamento', 'concluído') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_id) REFERENCES pool(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (sala_id) REFERENCES salas(id),
    FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id)
);

-- Tabela `relatorios`
CREATE TABLE relatorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT,
    tecnico_id INT,
    descricao TEXT,
    comeco TIMESTAMP NOT NULL,
    fim TIMESTAMP NOT NULL,
    duracao INT AS (TIMESTAMPDIFF(SECOND, comeco, fim)) STORED,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);

-- Tabela `pool_tecnico`
CREATE TABLE pool_tecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pool INT,
    tecnico_id INT,
    FOREIGN KEY (id_pool) REFERENCES pool(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);

-- Tabela `apontamentos_usuario`
CREATE TABLE apontamentos_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT NOT NULL,
    usuario_id INT NOT NULL,
    apontamento TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela `apontamentos_tecnico`
CREATE TABLE apontamentos_tecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chamado_id INT NOT NULL,
    tecnico_id INT NOT NULL,
    apontamento TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);

-- Tabela `avaliacoes`
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    chamado_id INT NOT NULL,
    tecnico_id INT NOT NULL,
    comentario TEXT NOT NULL,
    pontuacao INT NOT NULL,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chamado_id) REFERENCES chamados(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela `notificacoes`
CREATE TABLE notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tecnico_id INT NOT NULL,
    mensagem TEXT NOT NULL,
    visualizado TINYINT(1) DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
);

-- Tabela `equipamentos`
CREATE TABLE equipamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patrimonio INT NOT NULL,
    sala_id INT NOT NULL,
    equipamento VARCHAR(255) NOT NULL,
    FOREIGN KEY (sala_id) REFERENCES salas(id)
);

-- Índices adicionais para otimização
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_relatorios_comeco_fim ON relatorios(comeco, fim);


INSERT INTO salas (nome_sala) VALUES
('2026_A01_PRD_SL38_DEPOSITO'),
('2026_B02_EDU_SLGE_ROBOUM'),
('2026_D00_EDU_SL08_ESTUDOS'),
('2026_A00_EDU_SL02_PROJETOS'),
('2026_C02_EDU_SLGE_BIBLIOTECA'),
('2026_E02_ADM_SL19_RECEPBV'),
('2026_D00_EDU_SLGE_REALVIRTUAL'),
('2026_D00_EDU_SLGE_CADIII'),
('2026_D00_EDU_LB25_ENSINO'),
('2026_A00_EDU_SL15_ENSINO'),
('2026_A02_EDU_SLGE_MELETRICAI'),
('2026_D00_EDU_SL07_ATENDIMENTO'),
('2026_D00_EDU_SLGE_QUIMICA'),
('2026_A02_EDU_SL12_ENSINO'),
('2026_B02_EDU_SLGE_MICROCONTROL'),
('2026_A00_ADM_SL08_MANUTENCAO'),
('2026_A02_EDU_SLGE_MELETRICII'),
('2026_A02_EDU_SLGE_ELEDIGANALOG'),
('2026_B02_EDU_SLGE_ROBODOIS'),
('2026_B02_EDU_SLGE_PNEUMATICA'),
('2026_A02_EDU_SLGE_CLP'),
('2026_D02_EDU_SLGE_INFORMATIII'),
('2026_B02_EDU_SLGE_HIDRAULICA'),
('2026_D01_EDU_SLGE_DESENHOI'),
('2026_D01_EDU_SLGE_DESENHOII'),
('2026_C02_ADM_SL07_SERVIDOR');


