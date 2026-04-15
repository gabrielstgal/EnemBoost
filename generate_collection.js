import fs from 'fs';

const collection = JSON.parse(fs.readFileSync('EnemBoost.postman_collection.json', 'utf8'));


const conteudosFolder = collection.item.find(i => i.name === '2. Conteúdos');
const questoesFolder = collection.item.find(i => i.name === '3. Questões');
const simuladosFolder = collection.item.find(i => i.name === '4. Simulados');


conteudosFolder.item.push({
    name: "Obter Conteúdo por ID",
    request: { method: "GET", header: [], url: { raw: "http://localhost:5000/api/conteudos/:id", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "conteudos", ":id"], variable: [{ key: "id", value: "ID_AQUI" }] } }
}, {
    name: "Atualizar Conteúdo (Admin)",
    request: { method: "PUT", header: [{ key: "Authorization", value: "Bearer {{token}}" }, { key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: "{\n  \"titulo\": \"Conteúdo Atualizado\"\n}" }, url: { raw: "http://localhost:5000/api/conteudos/:id", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "conteudos", ":id"], variable: [{ key: "id", value: "ID_AQUI" }] } }
}, {
    name: "Deletar Conteúdo (Admin)",
    request: { method: "DELETE", header: [{ key: "Authorization", value: "Bearer {{token}}" }], url: { raw: "http://localhost:5000/api/conteudos/:id", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "conteudos", ":id"], variable: [{ key: "id", value: "ID_AQUI" }] } }
});


questoesFolder.item.push({
    name: "Obter Questão por ID",
    request: { method: "GET", header: [], url: { raw: "http://localhost:5000/api/questoes/:id", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "questoes", ":id"], variable: [{ key: "id", value: "ID_AQUI" }] } }
}, {
    name: "Atualizar Questão (Admin)",
    request: { method: "PUT", header: [{ key: "Authorization", value: "Bearer {{token}}" }, { key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: "{\n  \"texto\": \"Novo texto da questão\"\n}" }, url: { raw: "http://localhost:5000/api/questoes/:id", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "questoes", ":id"], variable: [{ key: "id", value: "ID_AQUI" }] } }
}, {
    name: "Deletar Questão (Admin)",
    request: { method: "DELETE", header: [{ key: "Authorization", value: "Bearer {{token}}" }], url: { raw: "http://localhost:5000/api/questoes/:id", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "questoes", ":id"], variable: [{ key: "id", value: "ID_AQUI" }] } }
});


simuladosFolder.item.push({
    name: "Obter Simulado por ID",
    request: { method: "GET", header: [], url: { raw: "http://localhost:5000/api/exames/:id", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "exames", ":id"], variable: [{ key: "id", value: "ID_AQUI" }] } }
}, {
    name: "Atualizar Simulado (Admin)",
    request: { method: "PUT", header: [{ key: "Authorization", value: "Bearer {{token}}" }, { key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: "{\n  \"titulo\": \"Simulado Atualizado\"\n}" }, url: { raw: "http://localhost:5000/api/exames/:id", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "exames", ":id"], variable: [{ key: "id", value: "ID_AQUI" }] } }
}, {
    name: "Deletar Simulado (Admin)",
    request: { method: "DELETE", header: [{ key: "Authorization", value: "Bearer {{token}}" }], url: { raw: "http://localhost:5000/api/exames/:id", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "exames", ":id"], variable: [{ key: "id", value: "ID_AQUI" }] } }
}, {
    name: "Listar Tentativas do Simulado",
    request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{token}}" }], url: { raw: "http://localhost:5000/api/exames/:id/tentativas", protocol: "http", host: ["localhost"], port: "5000", path: ["api", "exames", ":id", "tentativas"], variable: [{ key: "id", value: "ID_AQUI" }] } }
});

collection.info.name = "EnemBoost - Completo";

fs.writeFileSync('EnemBoost_Completo.postman_collection.json', JSON.stringify(collection, null, 2));
console.log('Collection gerada com sucesso: EnemBoost_Completo.postman_collection.json');
