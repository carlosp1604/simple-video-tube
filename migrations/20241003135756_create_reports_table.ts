import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('reports', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('user_email', 256).notNullable()
      table.string('user_ip', 40).notNullable()
      table.string('user_name', 256).notNullable()
      table.string('content', 1024).notNullable()
      table.string('type', 16).notNullable()
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
        .onDelete('CASCADE')
      table.primary(['user_ip', 'post_id', 'type'])
      table.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('reports')
}
