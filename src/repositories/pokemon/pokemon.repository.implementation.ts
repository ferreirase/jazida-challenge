import { dataSource } from '@config/database/dataSource';
import { Pokemon } from "@entities/pokemon.entity";
import "reflect-metadata";
import { injectable } from 'tsyringe';
import { Repository } from "typeorm/repository/Repository";
import { PokemonRepository } from './interface.repository';

@injectable()
export class PokemonRepositoryImplementation implements PokemonRepository {
  private readonly pokemonRepository: Repository<Pokemon>;
  
  constructor(){
    this.pokemonRepository = dataSource.getRepository(Pokemon);
  }

  async list(){
    return this.pokemonRepository.find();
  }

  async create(pokemon: Pick<Pokemon, 'tipo' | 'treinador'>){
    return this.pokemonRepository.save(pokemon);
  }

  async find(id: number){
    return this.pokemonRepository.findOne({
      where: { id }
    });
  }

  async remove(id: number){
    await this.pokemonRepository.delete(id);
  }

  async update(id: number, { treinador }: Pick<Pokemon, 'treinador'>){
    await this.pokemonRepository.update(id, { treinador });
  }

  async save(pokemon: Pokemon){
    await this.pokemonRepository.save(pokemon);
  }
}
