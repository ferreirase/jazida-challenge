import { PokemonService } from '@services/pokemon/pokemon.service';
import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';
import zod, { ZodError } from 'zod';
import { CustomError } from "../utils/CustomError";

const routes = Router();
const pokemonService = container.resolve(PokemonService); 

routes.get('/pokemons', async (_, res: Response) => {
  return res.json(await pokemonService.list());
});

routes.post('/pokemons', async (req: Request, res: Response) => {
  try {
    zod.object({
      tipo: zod.enum(['charizard', 'mewtwo', 'pikachu']),
      treinador: zod.string(),
    }).parse(req.body);
  
    const { tipo, treinador } = req.body;
  
    const pokemonCreated = await pokemonService.create({ tipo, treinador });
  
    return res.json(pokemonCreated);
  } catch (error) {
    if(error instanceof ZodError) {
      console.error(error);
      return res.status(400).json({ message: 'Erro de validação: Verifique os campos enviados!' });
    } 

    console.error(error);
    return res.status(400).json({ message: 'Generic error!' });
  }
});

routes.get('/pokemons/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const pokemon = await pokemonService.find(Number(id));

  if(!pokemon){
    return res.status(404).json({ message: 'Pokemon not found' });
  }

  return res.json({ pokemon });
});

routes.put('/pokemons/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    zod.object({
      treinador: zod.string(),
    }).parse(req.body);
  
    await pokemonService.update(Number(id), req.body);
  
    return res.status(204).send();
  } catch (error) {
    if(error instanceof ZodError) {
      console.error(error);
      return res.status(400).json({ message: 'Erro de validação: Verifique os campos enviados!' });
    } 

    if(error instanceof CustomError){
      return res.status(error?.status).json({ message: error.message });
    }

    console.error(error);
    return res.status(400).json({ message: error });
  }
});

routes.delete('/pokemons/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pokemonService.remove(Number(id));

    return res.status(204).send();
  } catch (error) {
    if(error instanceof CustomError){
      return res.status(error?.status).json({ message: error.message });
    }

    console.error(error);
    return res.status(400).json({ message: error });
  }
});


export default routes;
