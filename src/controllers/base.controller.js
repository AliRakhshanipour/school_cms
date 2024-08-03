import autoBind from 'auto-bind';

class BaseController {
  constructor() {
    autoBind(this);
  }
}

export default BaseController;
