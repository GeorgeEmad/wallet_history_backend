import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Transaction from 'App/Models/Transaction'
import Wallet from 'App/Models/Wallet'
import CreateTransactionValidator from 'App/Validators/CreateTransactionValidator'
import GetUserTransactionValidator from 'App/Validators/GetUserTransactionValidator'
import UpdateTransactionValidator from 'App/Validators/UpdateTransactionValidator'
import DeleteTransactionValidator from 'App/Validators/DeleteTransactionValidator'

export default class TransactionsController {
    /**
     * 
     * @param param0 
     * @returns 
     */
    public async getUserTransactions({ request, response, auth }: HttpContextContract) {
        let data = await request.validate(GetUserTransactionValidator)
        const limit = 10
        let wallet_id = auth.user?.id
        let transactions = await Transaction.query().where('wallet_id', Number(wallet_id))
            .if(data.type, (query) => {
                if (data.type) {
                    return query.where('type', data.type);
                }
            })
            .if(data.purpose, (query) => {
                if (data.purpose) {
                    return query.where('purpose', data.purpose);
                }
            })
            .if(data.from, (query) => {
                if (data.from) {
                    return query.where('created_at', '>=', data.from.toString());
                }
            })
            .if(data.to, (query) => {
                if (data.to) {
                    return query.where('created_at', '<=', data.to.toString());
                }
            })
            .paginate(data.params.page, limit)
        return response.json({
            message: 'user transactions',
            data: transactions.all(),
            meta: transactions.getMeta()
        })
    }

    /**
     * 
     * @param param0 
     * 
     * @returns 
     */
    public async createTransaction({ request, response, auth }: HttpContextContract) {
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

    /**
     * 
     * @param param0 
    */
    public async deleteTransaction({ request, response, auth }: HttpContextContract) {
        let data = await request.validate(DeleteTransactionValidator)
        let wallet_id = Number(auth.user?.id)
        let transaction = await Transaction.query().where('id', data.params.id).firstOrFail()
        const trx = await Database.transaction()
        let wallet = await Wallet.query(trx).where('id', wallet_id).firstOrFail()
        if (wallet.balance - transaction.amount < 0) {
            return response.status(400).json({
                message: "Not sufficient amount in balance to execute the transaction",
                data: {
                    amount: transaction.amount,
                    balance: wallet.balance
                }
            })
        }
        let balance_after_update = wallet.balance - transaction.amount
        try {
            await trx.from(Transaction.table).where('id', data.params.id).delete()
            await trx.from(Wallet.table).where('id', wallet_id).update({ balance: balance_after_update })
            await trx.commit()
            return response.created({
                message: 'transaction deleted'
            })
        } catch (error) {
            await trx.rollback()
            return response.status(400).json({
                message: "Error deleting transaction"
            })
        }
    }

    /**
     * 
     * @param param0 
     */
    public async updateTransaction({ request, response, auth }: HttpContextContract) {
        let data = await request.validate(UpdateTransactionValidator)
    
        let wallet_id = Number(auth.user?.id)
        if ((data.type === 'expense' && data.amount > 0) || (data.type === 'income' && data.amount < 0)) {
            return response.status(400).json({
                message: "Wrong logic, this type of transaction can't be with this amount. Income : +ve amount, expense: -ve amount",
                data: {
                    amount: data.amount,
                    type: data.type
                }
            })
        }
        const trx = await Database.transaction()
        let wallet = await Wallet.query(trx).where('id', wallet_id).firstOrFail()
        let oldTransaction = await Transaction.query(trx).where('id', data.params.id).firstOrFail()
        let amountChange =  data.amount - oldTransaction.amount
        if (wallet.balance + amountChange < 0) {
            return response.status(400).json({
                message: "Not sufficient amount in balance to execute the transaction",
                data: {
                    amount: amountChange,
                    balance: wallet.balance
                }
            })
        }

        let balance_after = wallet.balance + amountChange
        // let balance_before = wallet.balance
        try {
            await trx.from(Transaction.table).where('id', data.params.id).update({ type: data.type, amount: data.amount, purpose: data.purpose })
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


}
