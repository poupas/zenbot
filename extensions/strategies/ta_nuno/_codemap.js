module.exports = {
  _ns: 'zenbot',

  'strategies.ta_nuno': require('./strategy'),
  'strategies.list[]': '#strategies.ta_nuno'
}
