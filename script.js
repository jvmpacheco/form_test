// Configuração do cliente Supabase
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE';
const SUPABASE_KEY = 'SUA_CHAVE_ANON_DO_SUPABASE';

// Inicialização do cliente Supabase
const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Seleção dos elementos do DOM
const denunciaForm = document.getElementById('denunciaForm');
const denunciaTexto = document.getElementById('denunciaTexto');
const submitBtn = document.getElementById('submitBtn');

/**
 * Função para enviar a denúncia para o Supabase
 * @param {string} texto - O texto da denúncia
 * @returns {Promise} - Promessa que resolve com o resultado da inserção
 */
async function enviarDenuncia(texto) {
    try {
        // Inserção dos dados na tabela 'denuncias'
        const { data, error } = await supabase
            .from('denuncias')
            .insert([{
                texto: texto,
                data_criacao: new Date().toISOString()
            }]);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Erro ao enviar denúncia:', error.message);
        throw error;
    }
}

// Listener para o evento de submissão do formulário
denunciaForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Desabilita o botão durante o envio
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        // Obtém o texto da denúncia
        const texto = denunciaTexto.value.trim();

        // Valida se o texto não está vazio
        if (!texto) {
            alert('Por favor, digite sua denúncia antes de enviar.');
            return;
        }

        // Envia a denúncia
        await enviarDenuncia(texto);

        // Limpa o formulário e mostra mensagem de sucesso
        denunciaTexto.value = '';
        alert('Denúncia enviada com sucesso!');

    } catch (error) {
        // Mostra mensagem de erro
        alert('Erro ao enviar denúncia. Por favor, tente novamente.');
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submeter';
    }
});