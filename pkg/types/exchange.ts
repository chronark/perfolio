export type Exchange = {
  /**
   * Exchange abbreviation
   */
  exchange: string

  /**
   * 2 letter case insensitive string of country codes using ISO 3166-1 alpha-2
   */
  region: string

  /**
   * Full name of the exchange.
   */
  description: string

  /**
   * Market Identifier Code using ISO 10383
   */
  mic: string

  /**
   * Exchange Suffix to be added for symbols on that exchange
   */
  exchangeSuffix: string
}
