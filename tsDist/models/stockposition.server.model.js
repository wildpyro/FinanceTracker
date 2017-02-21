'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), _ = require('lodash'), Exchanges = require('../enums/exchanges.server.enums'), Schema = mongoose.Schema;
/**
 * Stockposition Schema
 */
var StockpositionSchema = new Schema({
    accountType: {
        type: String, enum: ['open', 'rsp', 'tfsa', 'resp', 'joint'],
        required: 'Please select an account type'
    },
    exchange: {
        type: String, enum: _.map(Exchanges.EXCHANGES, 'exchange')
    },
    symbol: {
        type: String,
        default: '',
        required: 'Please fill in a symbol',
        uppercase: true,
        trim: true
    },
    price: {
        type: Number,
        default: 0,
        required: 'Please fill in a price'
    },
    shares: {
        type: Number,
        default: 0,
        required: 'Please fill in the number of shares'
    },
    market: {
        type: Number,
        default: 0,
        required: 'Please fill in a market value'
    },
    book: {
        type: Number,
        default: 0,
        required: 'Please fill in the book cost'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    type: {
        type: String, enum: ['cash', 'fixed', 'equity'],
        required: 'Please select a position type',
        trim: true
    },
    quoteData: {}
});
var StockpositionTotalsSchema = new Schema({
    market: {
        type: Number,
        default: 0
    },
    book: {
        type: Number,
        default: 0
    },
    gainLoss: {
        type: Number,
        default: 0
    },
    gainLossPct: {
        type: Number,
        default: 0
    }
});
mongoose.model('Stockposition', StockpositionSchema);
mongoose.model('spTotals', StockpositionTotalsSchema);
//# sourceMappingURL=stockposition.server.model.js.map