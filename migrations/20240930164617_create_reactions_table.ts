import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('reactions', (table) => {
      table.string('user_ip', 40).notNullable().index()
      table.string('reaction_type', 16).notNullable().index()
      table.string('reactionable_id', 36).notNullable().index()
      table.string('reactionable_type', 36).notNullable().index()
      table.timestamps(true, true)
      table.timestamp('deleted_at').defaultTo(null)

      table.primary(['reactionable_type', 'reactionable_id', 'user_ip'])
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('reactions')
}
