import { readAll } from '../config/database.js';

// Chamados aceitos pelo técnico logado
export async function getChamadosDoTecnico(tecnicoId) {
    if (!tecnicoId) throw new Error('ID do técnico é obrigatório.');

    return await readAll(
        'chamados',
        `status = 'em andamento' AND tecnico_id = ${tecnicoId}`
    );
}
