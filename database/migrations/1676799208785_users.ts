import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email').notNullable().unique()
      table.string('phone_number', 12).notNullable().unique()
      table.string('password', 180).notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string('remember_me_token').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
