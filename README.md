## O desafio
  Elaborar um CRUD simples de pokemons e um algoritmo de batalha entre
eles.


## Subindo o servidor
  1. Clone/Baixe este repositório na sua máquina;

  2. Abra o terminal na raiz da pasta do projeto e rode os comandos *``` yarn install ```* ou *``` npm install ```* para instalar as dependências do projeto e depois o comando *``` yarn dev ```*  ou *``` npm run dev ```* para subir o servidor;

  4. Pronto, seu servidor backend está no ar e pronto pra ser acessado no endereço *``` http://localhost:3000 ```* ou na porta configurada no arquivo *``` .env ```*.


## Rotas e Parâmetros

``` /pokemons ```
```
- Verbo: GET
- Rota para listar todos os pokemons cadastrados;
- Retorno: um array de pokemons ou um array vazio;
```

```
- Verbo: POST
- Rota para criar um novo pokemon;
- Body: { "tipo": string,  "treinador": string };
- Retorno: um objeto com as informações do novo pokemon criado ou um erro de validação;
```

``` /pokemons/:id ```
```
- Verbo: PUT
- Rota para atualizar um pokemon existente. Apenas a propriedade treinador pode ser alterada;
- Retorno: 204 - No Content ou um erro se não encontrado
```

``` /pokemons/:id ```
```
- Verbo: GET
- Rota para buscar um pokemon por ID;
- Retorno: um objeto com as informações do pokemon encontrado ou um erro se não encontrado;
```

``` /pokemons/:id ```
```
- Verbo: DELETE
- Rota para deletar um pokemon;
- Retorno: 204 - No Content ou um erro se não encontrado;
```

## Tecnologias Utilizadas no Projeto

| **Backend**|
|----------- |
| *NodeJS*   |
| *Express*    |
| *TypeScript* |
| *SQLITE*     |
| *Tsyringe*  |
| *Zod*  |
| *TypeORM*  |
