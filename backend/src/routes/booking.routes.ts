import { Router } from "express";
import { bookUnsafe, bookSafe, resetDemo } from "../controllers/booking.controller";

const router = Router();

router.post('/book/unsafe', bookUnsafe);
router.post('/book/safe', bookSafe);
router.post('/reset', resetDemo);

export default router;