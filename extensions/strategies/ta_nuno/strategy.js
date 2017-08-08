var z = require('zero-fill')
  , n = require('numbro')

module.exports = function container (get, set, clear) {
  return {
    name: 'ta_nuno',
    description: 'Custom nuno strategy.',

    getOptions: function () {
      this.option('period', 'period length', String, '1h')
      this.option('min_periods', 'min. number of history periods', Number, 60)
      this.option('ema_period', 'number of periods for the EMA', Number, 13)
      this.option('sma_period', 'number of periods for the SMA', Number, 30)
    },

    calculate: function (s) {
      get('lib.ema')(s, 'ema', s.options.ema_period)
      get('lib.sma')(s, 'sma', s.options.sma_period)
      if (s.period.sma === undefined || s.period.ema === undefined) return;

      s.delta_price_and_sma_prev = s.lookback[0].close - s.lookback[0].sma
      s.delta_price_and_sma = s.period.close - s.period.sma
      s.delta_ema_and_sma_prev = s.lookback[0].ema - s.lookback[0].sma
      s.delta_ema_and_sma = s.period.ema - s.period.sma

      s.price_and_sma_crossed = (s.delta_price_and_sma_prev < 0 && s.delta_price_and_sma > 0) || (s.delta_price_and_sma_prev > 0 && s.delta_price_and_sma < 0)
      s.ema_and_sma_crossed = (s.delta_ema_and_sma_prev < 0 && s.delta_ema_and_sma > 0) || (s.delta_ema_and_sma_prev > 0 && s.delta_ema_and_sma < 0)
 
    },

    onPeriod: function (s, cb) {
      if (s.price_and_sma_crossed) {
        if (s.lookback[0].close > s.period.close && s.trend != 'down') {
          s.trend = 'down'
          s.acted_on_trend = false
	} else if (s.lookback[0].close < s.period.close && s.trend != 'up') {
          s.trend = 'up'
          s.acted_on_trend = false
        }
      }
 
      if (s.ema_and_sma_crossed) {
        if (s.trend === 'up') {
          s.signal = !s.acted_on_trend ? 'buy' : null
        } else if (s.trend === 'down') {
          s.signal = !s.acted_on_trend ? 'sell' : null
        }
        s.acted_on_trend = true
     }
      cb()
    },

    onReport: function (s) {
      var cols = []
      return cols
    }
  }
}
