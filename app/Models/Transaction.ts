import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Wallet from './Wallet'

export default class Transaction extends BaseModel {
  static get table() {
    return 'transaction'
  } 

  @column({ isPrimary: true })
  public id: number

  @column()
  public wallet_id: number

  @column()
  public type: 'income' | 'expense'

  @column()
  public amount: number

  @column()
  public balance_before: number

  @column()
  public balance_after: number

  @column()
  public purpose: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Wallet, {
    localKey: 'id',
    foreignKey: 'wallet_id',
  })
  public wallet: BelongsTo<typeof Wallet>

}
