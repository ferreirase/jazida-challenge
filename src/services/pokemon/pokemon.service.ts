import { Pokemon } from "@entities/pokemon.entity";
import { PokemonRepository } from '@repos/pokemon/interface.repository';
import { PokemonRepositoryImplementation } from '@repos/pokemon/pokemon.repository.implementation';
import "reflect-metadata";
import { injectable } from 'tsyringe';
import { CustomError } from "../../utils/CustomError";

@injectable()
export class PokemonService {
  private readonly pokemonRepository: PokemonRepository;

  constructor() {
    this.pokemonRepository = new PokemonRepositoryImplementation();
  }

  async list(){
    return this.pokemonRepository.list();
  }

  async create(pokemon: Pick<Pokemon, 'tipo' | 'treinador'>){
    return this.pokemonRepository.create(pokemon);
  }

  async find(id: number){
    return this.pokemonRepository.find(id);
  }

  async remove(id: number){
    const pokemon = await this.find(id);

    if(!pokemon){
      throw new CustomError('Pokemon not found', 404);
    }

    return this.pokemonRepository.remove(id);
  }

  async update(id: number, { treinador }: Pick<Pokemon, 'treinador'>){
    const pokemon = await this.find(id);

    if(!pokemon){
      throw new CustomError('Pokemon not found', 404);
    }

    await this.pokemonRepository.update(id, { treinador });
  }
}
