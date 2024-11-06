import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', async (table) => {
    table.timestamp('release_date').index().nullable().defaultTo(null)
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', (table) => {
    table.dropColumn('release_date')
  })
}
