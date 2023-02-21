import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeSave, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Wallet from './Wallet'

export default class User extends BaseModel {

  static get table() {
    return 'user'
  } 

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public phoneNumber: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Wallet)
  public wallet: HasOne<typeof Wallet>


  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

}
