import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Transaction from './Transaction'

export default class Wallet extends BaseModel {
  static get table() {
    return 'wallet'
  } 


  @column({ isPrimary: true })
  public id: number

  @column()
  public balance: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'id',
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Transaction, {
    foreignKey: 'wallet_id',
  })
  public transactions: HasMany<typeof Transaction>
}
