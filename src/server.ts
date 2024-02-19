import { dataSource } from '@config/database/dataSource';
import { specs } from '@config/swagger/index';
import { PokemonRepository } from '@repos/pokemon/interface.repository';
import { PokemonRepositoryImplementation } from '@repos/pokemon/pokemon.repository.implementation';
import routes from '@routes/index';
import { BattleService } from '@services/battle/battle.service';
import { PokemonService } from "@services/pokemon/pokemon.service";
import express from 'express';
import "reflect-metadata";
import { serve, setup } from 'swagger-ui-express';
import { container } from 'tsyringe';

container.register<PokemonRepository>('PokemonRepositoryImplementation', { useClass: PokemonRepositoryImplementation});
container.register<PokemonService>('PokemonService', { useClass: PokemonService });
container.register<BattleService>('BattleService', { useClass: BattleService });

const app = express();
const port = 3000;

app.use(express.json());

app.use(routes);

app.use('/api-docs', serve, setup(specs));

app.listen(port, () => {
  dataSource.initialize()
    .then(() => console.log('Database is connected'))
    .catch((error) => console.error('Error connecting to the database', error));
    
  console.log(`Server is running at http://localhost:${port}`);
});
