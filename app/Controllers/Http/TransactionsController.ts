import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Transaction from 'App/Models/Transaction'
import Wallet from 'App/Models/Wallet'
import CreateTransactionValidator from 'App/Validators/CreateTransactionValidator'
export default class TransactionsController {

    /**
     * 
     * @param param0 
     * 
     * @returns 
     */
    public async create_transaction({ request, response }: HttpContextContract) {
            let { wallet_id, type, amount, purpose } = await request.validate(CreateTransactionValidator)
            if ((type === 'expense' && amount > 0) || (type === 'income' && amount < 0)) {
                return response.status(400).json({
                    message: "Wrong logic, this type of transaction can't be with this amount. Income : +ve amount, expense: -ve amount",
                    data: {
                        amount: amount,
                        type: type
                    }
                })
            }
            const trx = await Database.transaction()
            let wallet = await Wallet.query(trx).where('id', wallet_id).firstOrFail()
            if (wallet.balance + amount < 0) {
                return response.status(400).json({
                    message: "Not sufficient amount in balance to execute the transaction",
                    data: {
                        amount: amount,
                        balance: wallet.balance
                    }
                })
            }
            let balance_before = wallet.balance
            let balance_after = wallet.balance + amount
            try {
                let transaction = await trx.insertQuery().table('transaction').insert({ wallet_id, type, amount, purpose, balance_before, balance_after })
                await trx.from(Wallet.table).where('id', wallet_id).update({ balance: balance_after })
                await trx.commit()
                return response.created({
                    message: 'transaction created',
                    data: transaction
                })
            } catch (error) {
                await trx.rollback()
                return response.status(400).json({
                    message: "Error creating transaction"
                })
            }
    }

}
