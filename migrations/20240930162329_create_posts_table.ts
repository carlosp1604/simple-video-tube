import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('posts', (table) => {
      table.string('id', 36).primary().notNullable()
      table.text('title').notNullable()
      table.text('description').notNullable()
      table.string('slug', 128).unique().notNullable()
      table.bigint('views_count').index().notNullable().defaultTo(0)
      table.integer('duration').notNullable()
      table.string('thumbnail_url', 512).notNullable()
      table.string('trailer_url', 512).nullable()
      table.string('external_url', 512).nullable()
      table.integer('resolution').notNullable()
      table.string('producer_id', 36)
        .references('id')
        .inTable('producers')
        .nullable()
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table.string('actor_id', 36)
        .references('id')
        .inTable('actors')
        .nullable()
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table.timestamps(true, true)
      table.timestamp('published_at').index().defaultTo(null)
      table.timestamp('deleted_at').defaultTo(null)

      table.index('title', 'post_title_index', {
        indexType: 'FULLTEXT',
      })
      table.index('description', 'post_description_index', {
        indexType: 'FULLTEXT',
      })
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('posts')
}
