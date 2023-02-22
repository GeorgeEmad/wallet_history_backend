
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/api/user/login', 'AuthController.userLogin') //login
Route.post('/api/user/register', 'AuthController.userRegister') //register
Route.post('/api/user/logout', 'AuthController.userLogout') //logout


Route.group(() => {
  Route.post('/api/wallet/create', 'WalletsController.createWallet') //create wallet
  Route.post('/api/transaction/create', 'TransactionsController.createTransaction') //create transaction
  Route.post('/api/transaction/get_all/:page', 'TransactionsController.getUserTransactions') //get transactions
  Route.post('/api/transaction/update/:id', 'TransactionsController.updateTransaction') //update transactions
  Route.post('/api/transaction/delete/:id', 'TransactionsController.deleteTransaction') //delete transactions

  Route.get('/api/wallet/get', 'WalletsController.getWallet') //get wallet
  Route.get('/api/user/get', 'UsersController.getUser') //get user
}).middleware(['auth:Users'])
