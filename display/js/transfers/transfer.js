/**
 * This class represents a global container that describes some part of resulting fields (or every one)
 * that are being returned from server
 */
class ReturnResult {
    //logon layer
    username;
    //user_rights layer
    is_admin;

    //async demo
    show_black_cars;

    constructor(DATA) {
        if(typeof DATA !== 'undefined') {
            this.username = DATA['username'];
            this.is_admin = DATA['is_admin'];
            this.show_black_cars = DATA['show_black_cars'];
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
