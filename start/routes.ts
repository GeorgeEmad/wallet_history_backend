/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//Authentication and Register
Route.post('/api/user/login', 'AuthController.user_login') //login
Route.post('/api/user/register', 'AuthController.user_register') //register
Route.post('/api/user/logout', 'AuthController.user_logout') //logout


Route.group(() => {
  Route.post('/api/wallet/create', 'WalletsController.create_wallet') //create wallet
  Route.post('/api/transaction/create', 'TransactionsController.create_transaction') //create transaction
  Route.post('/api/transaction/get_all/:page', 'TransactionsController.get_user_transactions') //get transactions

  Route.get('/api/wallet/get', 'WalletsController.get_wallet') //get wallet
  Route.get('/api/user/get', 'UsersController.get_user') //get user
}).middleware(['auth:Users'])
