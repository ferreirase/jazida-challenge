import { Pokemon } from "@entities/pokemon.entity";
import { PokemonRepository } from "@repos/pokemon/interface.repository";
import { PokemonRepositoryImplementation } from '@repos/pokemon/pokemon.repository.implementation';
import { injectable } from 'tsyringe';

@injectable()
export class BattleService {
  private readonly pokemonRepository: PokemonRepository;

  constructor() {
    this.pokemonRepository = new PokemonRepositoryImplementation();
  }

  async fight(pokemon1: Pokemon, pokemon2: Pokemon): Promise<{
    winner: Pokemon, 
    loser: Pokemon
  }> {
    
    const randomNumber = Math.random();

    if(randomNumber < (pokemon1.nivel / (pokemon1.nivel  + pokemon2.nivel ))){
      pokemon1.incrementarNivel(); 
      pokemon2.decrementarNivel();
      
      await this.saveOrRemove(pokemon1);
      await this.saveOrRemove(pokemon2);
      
      return {
        winner: pokemon1,
        loser: pokemon2
      };
    }

    pokemon2.incrementarNivel(); 
    pokemon1.decrementarNivel();
    
    await this.saveOrRemove(pokemon1);
    await this.saveOrRemove(pokemon2);

    return {
      winner: pokemon2,
      loser: pokemon1
    };
  }

  async saveOrRemove(pokemon: Pokemon): Promise<void> {
    pokemon.nivel === 0 ? await this.pokemonRepository.remove(pokemon.id) :
      await this.pokemonRepository.save(pokemon);
  }
}
