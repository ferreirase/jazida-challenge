import { Pokemon } from '@entities/pokemon.entity';

export interface PokemonRepository {
  list: () => Promise<Pokemon[]>;
  create: (pokemon: Pick<Pokemon, 'tipo' | 'treinador'>) => Promise<Pokemon>;
  update: (id: number, treinador: Pick<Pokemon, 'treinador'>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  find: (id: number) => Promise<Pokemon | null>;
  save: (pokemon: Pokemon) => Promise<void>;
};
