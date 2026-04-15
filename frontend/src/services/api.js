const BASE_URL = 'http://localhost:5000/api';


async function apiFetch(endpoint, options = {}) {
    
    const token = localStorage.getItem('token');
    
    
    const config = {
        ...options,
        headers: {
            ...(!options.isFormData && { 'Content-Type': 'application/json' }),
            ...options.headers,
        },
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...config,
        });

        
        if (response.status === 204) return null;

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensagem || 'Falha na requisição. Verifique seus dados.');
        }

        return data;
    } catch (error) {
        throw error;
    }
}


export const authService = {
    login: (email, senha) => apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    }),
    registrar: (nome, email, senha) => apiFetch('/registrar', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha }),
    }),
    obterEu: () => apiFetch('/eu', {
        method: 'GET',
    })
};


export const painelService = {
    obterEstatisticas: () => apiFetch('/painel', {
        method: 'GET',
    })
};


export const conteudoService = {
    obterConteudos: (materia = '') => {
        const query = materia ? `?materia=${materia}` : '';
        return apiFetch(`/conteudos${query}`, { method: 'GET' });
    },
    obterConteudoPorId: (id) => apiFetch(`/conteudos/${id}`, { method: 'GET' }),
    criarConteudo: (dados) => apiFetch('/conteudos', {
        method: 'POST',
        body: JSON.stringify(dados)
    })
};


export const exameService = {
    obterExames: () => apiFetch('/exames', { method: 'GET' }),
    obterExamePorId: (id) => apiFetch(`/exames/${id}`, { method: 'GET' }),
    obterMinhasTentativas: () => apiFetch('/exames/tentativas/minhas', { method: 'GET' }),
    enviarTentativa: (id, notaFinal, respostas) => apiFetch(`/exames/${id}/tentativas`, {
        method: 'POST',
        body: JSON.stringify({ notaFinal, respostas })
    }),
    criarExame: (dados) => apiFetch('/exames', {
        method: 'POST',
        body: JSON.stringify(dados)
    })
};


export const uploadService = {
    enviarPdf: async (file) => {
        const formData = new FormData();
        formData.append('pdfArquivo', file);
        return apiFetch('/upload', {
            method: 'POST',
            body: formData,
            isFormData: true 
        });
    }
};


export const questaoService = {
    obterQuestoes: () => apiFetch('/questoes', { method: 'GET' }),
    criarQuestao: (dados) => apiFetch('/questoes', {
        method: 'POST',
        body: JSON.stringify(dados)
    }),
    responderQuestao: (id, respostaUsuario) => apiFetch(`/questoes/${id}/responder`, {
        method: 'POST',
        body: JSON.stringify({ resposta: respostaUsuario })
    })
};

export default apiFetch;
