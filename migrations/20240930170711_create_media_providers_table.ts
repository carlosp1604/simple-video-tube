import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('media_providers', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('name', 128).notNullable().index()
      table.string('logo_url', 256).nullable()
      table.integer('advertising_level').notNullable()
      table.integer('download_speed').notNullable()
      table.boolean('payment_required').notNullable()
      table.integer('free_downloads_day').notNullable().defaultTo(0)
      table.integer('delay_between_downloads').notNullable().defaultTo(0)
      table.string('ref_url').notNullable()
      table.string('max_resolution').notNullable()
      table.boolean('multi_quality').notNullable().defaultTo(false)
      table.timestamps(true, true)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('media_providers')
}
