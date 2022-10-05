import BaseHook from './BaseHook.js';
import { Response } from 'express';
import { RequestI } from '../../lib/interfaces/Main.js';

class TestHook extends BaseHook {
  constructor() {
    const options = {
      name: 'testhook',
      active: true,
    };
    super(options);
  }
  run({boat, query}: RequestI, res: Response) {
    console.log(boat.client.user.username);
    res.send('Birds home page');
  }
}

export default TestHook;