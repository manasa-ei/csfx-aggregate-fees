const xblog = require('@xblockchainlabs/xblog');
const logger = xblog.logger();
const BigNumber = require('bignumber.js');
const { market } = require('../../constants');
const CURRENCY_MULTIPLIER = BigNumber(market.CURRENCY_PRECISION);
const { sequelize, Sequelize, Fees } = require('../../models')
const Op = Sequelize.Op;
const SteelToe = require('steeltoe');

exports.currenctByName = (req, res, next) => {
	const currency = SteelToe(req)('params')('currency_name')();
	const currencyInUpperCase = currency && currency.toUpperCase();
	Fees.findOne({where: { currency: currencyInUpperCase }}).then(result => {
		const fee = SteelToe(result)('fee')() || BigNumber(0);
		const feeWithoutMultiplier = fee.dividedBy(CURRENCY_MULTIPLIER);
		const lco = req.lco;
		return res.status(200).send({
			success: true,
			data: {
				currency: SteelToe(result)('currency')(),
				fee: feeWithoutMultiplier
			}
		});
	})
	.catch(err => {
		logger(req.lco).error(err, "Got error in finding records.",{});
		next(err);
	})
	
};
