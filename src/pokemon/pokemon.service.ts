import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity.js';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    if (isValidObjectId(term) && !pokemon) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term,
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonFound = await this.findOne(term);

    try {
      const updatedPokemon = await this.pokemonModel.findOneAndUpdate(
        { _id: pokemonFound._id },
        { $set: updatePokemonDto },
        { new: true },
      );
      return updatedPokemon;
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // await this.findOne(id);

    // await this.pokemonModel.findByIdAndDelete(id);

    // Another way to delete a document by id whitout make double query to the database
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id}" not found`);

    return 'Pokemon deleted successfully';
  }

  private handleExceptions(error: any) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue ?? {})[0] ?? 'field';
      const value = error.keyValue?.[field] ?? 'unknown';
      throw new BadRequestException(
        `Pokemon with ${field} "${value}" already exists`,
      );
    }
    throw new InternalServerErrorException(`Server error - Check server logs`);
  }
}
