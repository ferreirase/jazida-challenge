import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pokemons API',
      version: '1.0.0',
      description: 'API de CRUD de pokemons e batalha',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
