import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diets', (table) => {
    table.string('session_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diets')
}
