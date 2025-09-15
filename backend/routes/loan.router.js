import { getAdminLoans, getAllLoans, getLoanById, postLoan } from "../controller/loan.controller";
import isAuthenticated from "../middleware/isAuthenticated";


const router=express.router();     //create express router app for handling all routes within here

router.route("/post").post(isAuthenticated,postLoan);
router.route("/get").get(isAuthenticated,getAllLoans);
router.route("/get/:id").get(isAuthenticated,getLoanById);
router.route("/getAdminLoans").get(isAuthenticated,getAdminLoans);

export default router;