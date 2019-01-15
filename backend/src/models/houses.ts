import { QueryBuilder } from 'knex';
import db from '../../data/dbConfig';
import { House } from '../interface';

export const findHouses = () => {
  return db('house')
    .leftJoin('assistant', { 'house.default_ast': 'assistant.id' })
    .leftJoin('user', { 'assistant.user_id': 'user.id' })
    .select(
      'house.id',
      'house.name',
      'house.address',
      'house.default_ast',
      'user.full_name as default_ast_name',
      'house.manager',
      'house.guest_guide',
      'house.ast_guide',
    )
    .map(async (e: any) => {
      const openAst = await db('house_ast')
        .where({ 'house_ast.house_id': e.id })
        .leftJoin('assistant', { 'house_ast.ast_id': 'assistant.id' })
        .leftJoin('user', { 'assistant.user_id': 'user.id' })
        .select(
          'user.full_name',
          'assistant.id as ast_id',
          'house_ast.house_id',
        );
      const checkList = await db('list')
        .where({ 'list.house_id': e.id })
        .leftJoin('items', { 'list.id': 'items.list_id' })
        .count('items.task');
      return { ...e, openAst, checkList };
    });
};

export const findHouse = (id: number): QueryBuilder => {
  return db('house')
    .first()
    .where({ id });
};

export const makeHouse = (house: House): QueryBuilder => {
  return db('house').insert(house);
};

export const updateHouse = (updatedHouse: House): QueryBuilder => {
  const id = updatedHouse.id;
  return db('house')
    .where({ id })
    .update(updatedHouse);
};

export const deleteHouse = (id: number): QueryBuilder => {
  return db('house')
    .where({ id })
    .del();
};
