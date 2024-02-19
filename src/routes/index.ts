import { BattleService } from "@services/battle/battle.service";
import { PokemonService } from '@services/pokemon/pokemon.service';
import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';
import zod, { ZodError } from 'zod';
import { CustomError } from "../utils/CustomError";

const routes = Router();
const pokemonService = container.resolve(PokemonService); 
const battleService = container.resolve(BattleService); 

/**
 * @swagger
 * /pokemons:
 *   get:
 *     summary: Listar todos os pokemons
 *     description: Retorna uma lista de todos os pokemons.
 *     responses:
 *       200:
 *         description: Lista de pokemons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pokemon'
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Pokemon:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: ID do Pokémon
 *         nome:
 *           type: string
 *           description: Nome do Pokémon
 *         tipo:
 *           type: string
 *           description: Tipo do Pokémon
 *         treinador:
 *           type: string
 *           description: Treinador do Pokémon
 *       required:
 *         - nome
 *         - tipo
 *         - treinador
 */
routes.get('/pokemons', async (_, res: Response) => {
  return res.json(await pokemonService.list());
});

/**
 * @swagger
 * /pokemons:
 *   post:
 *     summary: Criar um novo Pokémon
 *     description: Cria um novo Pokémon.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePokemonDTO'
 *     responses:
 *       200:
 *         description: Pokémon criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePokemonDTO:
 *       type: object
 *       properties:
 *         tipo:
 *           type: string
 *           enum: [charizard, mewtwo, pikachu]
 *           description: Tipo do Pokémon
 *         treinador:
 *           type: string
 *           description: Treinador do Pokémon
 *       required:
 *         - tipo
 *         - treinador
 */
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

/**
 * @swagger
 * /pokemons/{id}:
 *   get:
 *     summary: Buscar pelo ID
 *     description: Busca um pokemon pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do Pokémon
 *     responses:
 *       200:
 *         description: Pokémon encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokemon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
routes.get('/pokemons/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const pokemon = await pokemonService.find(Number(id));

  if(!pokemon){
    return res.status(404).json({ message: 'Pokemon not found' });
  }

  return res.json({ pokemon });
});

/**
 * @swagger
 * /pokemons/{id}:
 *   put:
 *     summary: Atualizar um Pokémon
 *     description: Atualizar um Pokémon.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePokemonDTO'
 *     responses:
 *       204:
 *         description: Pokémon atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePokemonDTO:
 *       type: object
 *       properties:
 *         treinador:
 *           type: string
 *           description: Treinador do Pokémon
 *       required:
 *         - treinador
 */
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

/**
 * @swagger
 * /pokemons/{id}:
 *   delete:
 *     summary: Deletar um pokémon
 *     description: Deletar um pokémon.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do Pokémon
 *     responses:
 *       204:
 *         description: Pokémon deletado com sucesso
 *       400:
 *         description: Erro ao deletar o pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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

/**
 * @swagger
 * /pokemons/batalhar/{pokemonAId}/{pokemonBId}:
 *   post:
 *     summary: Iniciar uma batalha entre dois Pokémons
 *     description: Inicia uma batalha entre os Pokémons com os IDs especificados.
 *     parameters:
 *       - in: path
 *         name: pokemonAId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do primeiro Pokémon
 *       - in: path
 *         name: pokemonBId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do segundo Pokémon
 *     responses:
 *       200:
  *         description: Batalha concluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vencedor:
 *                   type: object
 *                   description: O Pokémon vencedor da batalha
 *                   $ref: '#/components/schemas/Pokemon'
 *                 perdedor:
 *                   type: object
 *                   description: O Pokémon perdedor da batalha
 *                   $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokémon não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Pokémon não encontrado'
 */
routes.post('/pokemons/batalhar/:pokemonAId/:pokemonBId', async (req: Request, res: Response) => { 
  try {
    const { pokemonAId, pokemonBId } = req.params;

    const [pokemonA, pokemonB] = await Promise.all([
      pokemonService.find(Number(pokemonAId)),
      pokemonService.find(Number(pokemonBId))
    ]);

    if(!pokemonA || !pokemonB){
      return res.status(404).json({ message: 'Pokemon not found' });
    } 

    const { winner, loser } = await battleService.fight(pokemonA, pokemonB);

    return res.json({ vencedor: winner, perdedor: loser });
  } catch (error) {
    if(error instanceof CustomError){
      return res.status(error?.status).json({ message: error.message });
    }

    console.error(error);
    return res.status(400).json({ message: error });
  }
});


export default routes;
