# API PARA CONEXÃO COM BANCO DE DADOS FIREBIRD

Essa API possibilita a comunicação de clientes seja ele Desktop, mobile ou web. Porém, deixei duas rotas configuradas, uma para clientes e outra para produtos.
Além disso, uma rota de login básica foi criada e em outro repositório vou colocar um APP em Flutter que conecta diretamente com ela.

# Uso
1. Ter a base de dados com tabela clientes, produtos e usuários.
2. Definir no arquivo src/config/database o diretório do DB
3. Definir o token a ser usado em "tokenacess" no cliente / servidor.
4. Para iniciar digite "cd src"
5. "node index.cjs"

# Token
Definido como fixo, pensando em solução onde somente aquele cliente específico pode se conectar.
