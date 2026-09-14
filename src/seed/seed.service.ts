import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface.js';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity.js';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter.js';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    try {
      const data = await this.http.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=500',
      );
      if (!data?.results?.length) {
        throw new InternalServerErrorException(
          'PokeAPI no devolvió resultados',
        );
      }

      const pokemonInsert = data.results.map(({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];

        return { name, no };
      });

      await this.pokemonModel.deleteMany({});
      await this.pokemonModel.insertMany(pokemonInsert);
      //await this.pokemonModel.create({ name, no });
      return {
        message: 'Seed executed',
        inserted: pokemonInsert.length,
      };
    } catch (error: any) {
      if (error instanceof InternalServerErrorException) throw error;

      throw new InternalServerErrorException(
        `Error ejecutando seed: ${error.message}`,
      );
    }
  }
}
