import { ObjectId, Timestamp } from "mongodb";

export default class Price {
    constructor(public symbol: string, public price: number, public timestamp: Timestamp, public id?: ObjectId) {}
}