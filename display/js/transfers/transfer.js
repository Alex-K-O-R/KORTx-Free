/**
 * This class represents a global container that describes some part of resulting fields (or every one)
 * that are being returned from server
 */
class ReturnResult {
    is_authorized;
    is_admin;

    constructor(DATA) {
        if(typeof DATA !== 'undefined') {
            this.is_authorized = (DATA['seconds'] > 30);
            this.is_admin = this.is_authorized && ((DATA['seconds'] % 2) == 1);
        }
    }
}

/**
 * Yet another response example
 */
class AnotherReply {
    DATA;
    MESSAGE;
    STATUS;
}
