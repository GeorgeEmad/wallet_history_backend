import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transaction'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('balance_before').notNullable
      table.integer('balance_after').notNullable
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('balance_before')
      table.dropColumn('balance_after')
    })
  }
}
