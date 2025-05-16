// Configuração do cliente Supabase
const supabaseUrl = 'https://gpogvygpfwehkuqepnyn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwb2d2eWdwZndlaGt1cWVwbnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzI3NDAsImV4cCI6MjA2MjkwODc0MH0.9xZ1uKP-prUgjlWWT-2CFhKvtbg-Ta8uRdp_MGr9haM';

// Inicialização do cliente Supabase
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Seleção dos elementos do DOM
const denunciaForm = document.getElementById('denunciaForm');
const denunciaTexto = document.getElementById('denunciaTexto');
const submitBtn = document.getElementById('submitBtn');

// Elementos para teste de conexão (comentados)
/*
const testBtn = document.getElementById('testBtn');
const testeResultado = document.getElementById('testeResultado');
const testeStatus = document.getElementById('testeStatus');
const testeDetalhes = document.getElementById('testeDetalhes');
*/

/**
 * Função para enviar a denúncia para o Supabase
 * @param {string} texto - O texto da denúncia
 * @returns {Promise} - Promessa que resolve com o resultado da inserção
 */
async function enviarDenuncia(texto) {
    try {
        // Inserção dos dados na tabela 'denuncias'
        const { data, error } = await supabaseClient
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



/**
 * Funções para testar a conexão com o Supabase (comentadas)
 * Estas funções podem ser descomentadas para testar a conexão com o Supabase
 * antes de usar o formulário principal.
 */

/*
// Função para testar a conexão com o Supabase
async function testarConexao() {
    try {
        console.log('Iniciando teste de conexão com o Supabase...');
        
        // Cria um dado de teste com timestamp para identificar facilmente
        const timestamp = new Date().toISOString();
        const dadoTeste = {
            texto: `Teste de conexão realizado em ${timestamp}`,
            data_criacao: timestamp
        };
        
        console.log('Enviando dado de teste:', dadoTeste);
        
        // Tenta inserir o dado de teste na tabela 'denuncias'
        const { data, error } = await supabaseClient
            .from('denuncias')
            .insert([dadoTeste]);

        if (error) {
            console.error('Erro durante o teste de conexão:', error);
            throw new Error(`Erro do Supabase: ${error.message}`);
        }

        // Verifica se o dado foi inserido consultando a tabela
        console.log('Dado inserido com sucesso, verificando se está na tabela...');
        
        const { data: verificacao, error: erroVerificacao } = await supabaseClient
            .from('denuncias')
            .select('*')
            .eq('data_criacao', timestamp)
            .limit(1);

        if (erroVerificacao) {
            console.error('Erro ao verificar o dado inserido:', erroVerificacao);
            throw new Error(`Erro ao verificar: ${erroVerificacao.message}`);
        }

        if (verificacao && verificacao.length > 0) {
            console.log('Teste concluído com sucesso! Dado encontrado na tabela:', verificacao[0]);
            return {
                sucesso: true,
                mensagem: 'Conexão com o Supabase está funcionando corretamente!',
                dados: verificacao[0]
            };
        } else {
            console.warn('Dado foi inserido mas não foi encontrado na consulta');
            return {
                sucesso: true,
                mensagem: 'Dado foi inserido, mas não foi possível verificar se está na tabela.',
                dados: data
            };
        }
    } catch (error) {
        console.error('Erro no teste de conexão:', error);
        return {
            sucesso: false,
            mensagem: `Falha no teste de conexão: ${error.message}`,
            erro: error
        };
    }
}

// Função para exibir o resultado do teste na interface
function exibirResultadoTeste(resultado) {
    // Limpa os conteúdos anteriores
    testeStatus.innerHTML = '';
    testeDetalhes.innerHTML = '';
    
    // Exibe a área de resultados
    testeResultado.style.display = 'block';
    
    if (resultado.sucesso) {
        // Configura a aparência para sucesso
        testeStatus.className = 'teste-status sucesso';
        testeStatus.textContent = resultado.mensagem;
        
        // Formata os detalhes do resultado
        const detalhes = {
            ID: resultado.dados.id || 'Não disponível',
            Texto: resultado.dados.texto || 'Não disponível',
            'Data de Criação': resultado.dados.data_criacao || 'Não disponível',
            'Timestamp do Teste': new Date().toLocaleString()
        };
        
        // Cria a visualização dos detalhes
        testeDetalhes.innerHTML = Object.entries(detalhes)
            .map(([chave, valor]) => `<strong>${chave}:</strong> ${valor}`)
            .join('<br>');
    } else {
        // Configura a aparência para erro
        testeStatus.className = 'teste-status erro';
        testeStatus.textContent = resultado.mensagem;
        
        // Exibe detalhes do erro se disponíveis
        if (resultado.erro) {
            testeDetalhes.textContent = JSON.stringify(resultado.erro, null, 2);
        } else {
            testeDetalhes.textContent = 'Nenhum detalhe adicional disponível sobre o erro.';
        }
    }
    
    // Rola a página para mostrar o resultado
    testeResultado.scrollIntoView({ behavior: 'smooth' });
}

// Adiciona o evento de clique ao botão de teste
testBtn.addEventListener('click', async () => {
    // Altera o texto do botão para indicar que está testando
    testBtn.disabled = true;
    testBtn.textContent = 'Testando...';
    
    try {
        // Oculta resultados anteriores enquanto testa
        testeResultado.style.display = 'none';
        
        // Executa o teste de conexão
        const resultado = await testarConexao();
        
        // Exibe o resultado na interface
        exibirResultadoTeste(resultado);
        
        if (resultado.sucesso) {
            console.log('Teste de conexão bem-sucedido:', resultado);
        } else {
            console.error('Falha no teste de conexão:', resultado.erro);
        }
    } catch (error) {
        // Exibe mensagem em caso de erro inesperado
        console.error('Erro inesperado durante o teste:', error);
        
        exibirResultadoTeste({
            sucesso: false,
            mensagem: `Erro inesperado durante o teste: ${error.message}`,
            erro: error
        });
    } finally {
        // Restaura o botão
        testBtn.disabled = false;
        testBtn.textContent = 'Testar Conexão';
    }
});
*/