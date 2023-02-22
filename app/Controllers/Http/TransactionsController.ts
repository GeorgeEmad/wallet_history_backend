import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Transaction from 'App/Models/Transaction'
import Wallet from 'App/Models/Wallet'
import CreateTransactionValidator from 'App/Validators/CreateTransactionValidator'
import GetUserTransactionValidator from 'App/Validators/GetUserTransactionValidator'
export default class TransactionsController {

    /**
     * 
     * @param param0 
     * 
     * @returns 
     */
    public async create_transaction({ request, response, auth }: HttpContextContract) {
        let { type, amount, purpose } = await request.validate(CreateTransactionValidator)
        let wallet_id = Number(auth.user?.id)
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
            await trx.insertQuery().table('transaction').insert({ wallet_id, type, amount, purpose, balance_before, balance_after })
            await trx.from(Wallet.table).where('id', wallet_id).update({ balance: balance_after })
            await trx.commit()
            return response.created({
                message: 'transaction created'
            })
        } catch (error) {
            await trx.rollback()
            return response.status(400).json({
                message: "Error creating transaction"
            })
        }
    }

    public async get_user_transactions({ request, response, auth }: HttpContextContract) {
        let data = await request.validate(GetUserTransactionValidator)
        const limit = 10
        let wallet_id = auth.user?.id
        console.log(data.type)
        let transactions = await Transaction.query().where('wallet_id', Number(wallet_id))
        .if(data.type, (query) => {
            if(data.type){  
                return query.where('type', data.type);
            }
         })
        .if(data.purpose, (query) => {
            if(data.purpose){  
                return query.where('purpose', data.purpose);
            }
         })
        .paginate(data.params.page, limit)
        return response.json({
            message: 'user transactions',
            data: transactions.all(),
            meta: transactions.getMeta()
        })
    }


}
