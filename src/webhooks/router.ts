import { Router } from 'express';
import { RequestI } from '../../lib/interfaces/Main.js';
import { util } from '../util/index.js';
import BaseHook from './BaseHook';
import hooks from './index.js';
const router = Router();

const verify = (req: RequestI, res, next) => {
  if (!req.header('authorization')) {
    return res.status(401).json({ error: 'No credentials sent!' });
  }

  if (req.header('authorization') !== process.env.HOOK_TOKEN) {
    return res.status(401).json({ error: 'No credentials sent!' });
  }

  next()
}

util.objForEach(hooks, hook => {
  const hc = new hook() as BaseHook;
  if (hc.active) {
    if (hc.gate) {
      router.get(`/${hc.name}`, verify, hc.run)
    } else router.get(`/${hc.name}`, hc.run)
  }
})

export default router;