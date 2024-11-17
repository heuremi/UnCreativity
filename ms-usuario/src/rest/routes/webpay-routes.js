import  express  from 'express'
import { create, commit, checkToken } from '../controllers/webpay-controlador.js'



/*
router.use(function (req, res, next) {
    // integrar a .env logica de integracion o produccion
    WebpayPlus.configureForIntegration()
    next()
})
*/

const webpayPlusRouter = express.Router()

webpayPlusRouter.post("/create", create)
webpayPlusRouter.get("/commit", commit)
webpayPlusRouter.post("/commit", commit)
webpayPlusRouter.get('/status', checkToken)


export default webpayPlusRouter