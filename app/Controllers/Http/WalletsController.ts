import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Wallet from 'App/Models/Wallet'

export default class WalletsController {

    /**
     * create wallet
     * @param param0 
     * @returns 
     */
    public async createWallet({ response, auth }: HttpContextContract) {
        try {
            const created_wallet = await Wallet.create({
                id: auth.user?.id,
            })
            return response.created({
                message: 'wallet created',
                data: created_wallet
            })
        } catch (error) {
            return response.status(400).send({ message: 'error creating wallet, wallet already created for this user'})
        }
    }

    /**
     * get wallet
     * @param param0 
     * @returns 
     */
    public async getWallet({ response, auth }: HttpContextContract) {
        try {
            let wallet = await Wallet.findOrFail(auth.user?.id)
            return response.json({
                message: 'user wallet',
                data: wallet
            })
        } catch (error) {
            return response.status(400).send({ message: 'error finding wallet' })
        }
    }
    
}
