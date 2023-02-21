import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transaction'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('wallet_id').notNullable().references('wallet.id').onDelete('CASCADE')
      table.integer('amount').notNullable()
      table.enu('type', ['income', 'expense'], {
        useNative: true,
        enumName: 'transaction_types',
        existingType: false,
      })
      table.string('purpose', 255).notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
