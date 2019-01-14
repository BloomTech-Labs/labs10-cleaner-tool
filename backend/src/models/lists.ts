import { QueryBuilder } from 'knex';
import db from '../../data/dbConfig';

export const findLists = async (houseId: number) => {
  try {
    const before = await db('list')
      .where({ house_id: houseId, type: 'before' })
      .leftJoin('items', { 'list.id': 'items.list_id' })
      .select('items.task', 'items.id as items_id');
    const during = await db('list')
      .where({ house_id: houseId, type: 'during' })
      .leftJoin('items', { 'list.id': 'items.list_id' })
      .select('items.task', 'items.id as items_id');
    const after = await db('list')
      .where({ house_id: houseId, type: 'after' })
      .leftOuterJoin('after_list', { 'list.id': 'after_list.list_id' })
      .select('list.id', 'after_list.hours_after')
      .map(async (row: any) => {
        const hours: string = `hours after ${row.hours_after}`;
        const afterLists = await db('items')
          .where({ 'items.list_id': row.id })
          .select('items.task', 'items.id as items_id');

        return { [hours]: afterLists };
      })
      .catch((e) => {
        console.error(e);
      });
    return { before, during, after };
  } catch (e) {
    throw console.error(e);
  }
};

const beforeAfterList = (type: string, houseId: number, stayId: number) => {
  try {
    return db('list')
      .leftJoin('items', { 'list.id': 'items.list_id' })
      .leftJoin('item_complete', { 'item_complete.item_id': 'items.id' })
      .select(
        'item_complete.complete',
        'items.task',
        'items.id as items_id',
        'item_complete.stay_id',
      )
      .where({
        'item_complete.stay_id': stayId,
        'list.house_id': houseId,
        'list.type': type,
      });
  } catch (e) {
    console.error(e);
  }
};

export const findListsStay = async (houseId: number, stayId: number) => {
  try {
    const before = await beforeAfterList('before', houseId, stayId);
    const during = await beforeAfterList('during', houseId, stayId);
    const after = await db('list')
      .where({ house_id: houseId, type: 'after' })
      .leftOuterJoin('after_list', { 'list.id': 'after_list.list_id' })
      .select('list.id', 'after_list.hours_after')
      .map(async (row: any) => {
        const hours: string = `hours after ${row.hours_after}`;
        const afterLists = await db('items')
          .where({ 'items.list_id': row.id, 'item_complete.stay_id': stayId })
          .select(
            'item_complete.complete',
            'items.task',
            'items.id as items_id',
            'item_complete.stay_id',
          )
          .leftJoin('item_complete', { 'item_complete.item_id': 'items.id' });
        return { [hours]: afterLists };
      })
      .catch((e) => {
        console.error(e);
      });
    return { before, during, after };
  } catch (e) {
    console.error(e);
  }
};