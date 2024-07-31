import autoBind from "auto-bind";

class BaseService {
    constructor() {
        autoBind(this);
    }
}

export default BaseService;
