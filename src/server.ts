import { dataSource } from '@config/database/dataSource';
import { PokemonRepository } from '@repos/pokemon/interface.repository';
import { PokemonRepositoryImplementation } from '@repos/pokemon/pokemon.repository.implementation';
import routes from '@routes/index';
import { PokemonService } from "@services/pokemon/pokemon.service";
import express from 'express';
import "reflect-metadata";
import { container } from 'tsyringe';

container.register<PokemonRepository>('PokemonRepositoryImplementation', { useClass: PokemonRepositoryImplementation});
container.register<PokemonService>('PokemonService', { useClass: PokemonService });

const app = express();
const port = 3000;

app.use(express.json());

app.use(routes);

app.listen(port, () => {
  dataSource.initialize()
    .then(() => console.log('Database is connected'))
    .catch((error) => console.error('Error connecting to the database', error));
    
  console.log(`Server is running at http://localhost:${port}`);
});
