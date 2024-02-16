import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type TipoPokemon = 'charizard' | 'mewtwo' | 'pikachu';

@Entity({ name: 'pokemons' })
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: TipoPokemon;

  @Column()
  treinador: string;

  @Column({ default: 1 })
  nivel: number;

  incrementarNivel(): void {
    this.nivel++;
  }

  decrementarNivel(): void {
    if (this.nivel > 0) {
      this.nivel--;
    }
  }
}
