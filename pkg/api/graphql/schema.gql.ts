import { gql } from "graphql-tag"
export default gql`
  """
  A unix timestamp with second precision
  """
  scalar Timestamp

  """
  The interval for timeseries
  """
  enum Interval {
    """
    One rate per day
    """
    DAILY

    """
    One rate per month
    """
    MONTHLY

    """
    One rate per year
    """
    ANNUAL
  }

  """
  A sub type of assets that are all traded at exchanges
  """
  interface ExchangeTradedAsset implements Asset {
    """
    A globally unique id
    """
    id: ID!

    """
    The ticker as used by the exchanges.
    """
    ticker: String!

    """
    Human readable name
    """
    name: String!

    """
    URL to the logo or image
    """
    logo: String!
  }

  """
  Stocks such as company shares and funds.
  """
  type CompanyStock implements ExchangeTradedAsset & Asset {
    """
    For stocks we are always using the isin as id.
    """
    id: ID!

    """
    International Securities Indentification Number
    """
    isin: String!

    """
    The companys name
    """
    name: String!

    """
    The companys logo url
    """
    logo: String!

    """
    The ticker of a stock. This does not include pre/suffixes for different exchanges
    """
    ticker: String!

    """
    The main sector of this company
    """
    sector: String!
    """
    The country where this company is registered
    """
    country: String!
  }
  """
  Crypto
  """
  type Crypto implements ExchangeTradedAsset & Asset {
    """
    A globally unique id
    """
    id: ID!
    """
    Dummy field
    """
    name: String!
    """
    A
    """
    ticker: String!

    """
    B
    """
    logo: String!
  }

  """
  Common fields on all assets
  """
  interface Asset {
    """
    Globally unique id
    """
    id: ID!
  }

  """
  A transactions represents a single purchase or sale of any number of shares of a single asset.
  """
  type Transaction {
    """
    Reference to the actual asset
    """
    assetId: String!
    """
    The of asset. Stocks, Crypto, Real estate for example.
    """
    asset: ExchangeTradedAsset!

    """
    A timestamp when the transaction was executed
    """
    executedAt: Timestamp!

    """
    A globally unique identifier for each transaction
    """
    id: ID!

    """
    The portfolio of this transaction
    """
    portfolioId: ID!

    """
    How much each share/item was bought/sold for
    """
    value: Float!

    """
    How many shares/items the user bought or sold

    negative if sold
    """
    volume: Float!

    """
    The market identifier code where the user intends to sell this asset
    """
    mic: String
  }

  """
  Create a new transaction
  """
  input CreateTransaction {
    """
    The asset id identifies the asset, this will be prefixed by 'stock_' for stocks
    """
    assetId: ID!

    """
    A timestamp when the transaction was executed
    """
    executedAt: Timestamp!

    """
    The portfolio of this transaction
    """
    portfolioId: ID!

    """
    How much each share/item was bought/sold for
    """
    value: Float!

    """
    How many shares/items the user bought or sold
    """
    volume: Float!

    """
    The market identifier code where the user intends to sell this asset
    """
    mic: String
  }

  """
  A user of perfol.io
  """
  type User {
    """
    A unique identifier: stored as uuid
    """
    id: ID!

    """
    The user's email
    """
    email: String!

    """
    The user's settings
    """
    settings: Settings

    """
    Stripe customer id
    """
    stripeCustomerId: ID!

    portfolios: [Portfolio!]!
  }

  """
  Access scope
  """
  enum Access {
    """
    Everyone has access
    """
    PUBLIC
    """
    Only the createor and shared users have access
    """
    PRIVATE
  }
  type Portfolio {
    """
    unique id
    """
    id: ID!
    """
    Human readable name for the portfolio
    """
    name: String!
    """
    The owner of this portfolio
    """
    user: User!
    """
    The primary portfolio will be displayed by default
    """
    primary: Boolean!

    """
    Associated transactions
    """
    transactions: [Transaction!]!

    """
    Return an index for the performance of the users portfolio
    """
    relativeHistory("unix timestamp where to begin calculation" since: Int): [ValueAtTime!]!

    """
    Return all assets over time for a given user
    """
    absoluteHistory: [AssetHistory!]!
  }

  input CreatePortfolio {
    """
    unique id
    """
    id: ID!
    """
    Human readable name for the portfolio
    """
    name: String!
    """
    The owner of this portfolio
    """
    userId: ID!
    """
    The primary portfolio will be displayed by default
    """
    primary: Boolean
    """
    Public portfolios can be seen by anyone with the portfolio id
    Private portfolios are only visible to the owner and users who were
    granted access.
    """
    access: Access
    """
    Ids of users who have read access for this portfolio
    """
    grantReadAccess: [ID!]
    """
    Associated transactions
    """
    transactions: [CreateTransaction!]
  }

  """
  Settings that can be customized by the user such as preferences as well as defaults
  """
  type Settings {
    """
    The user's default currency. Everything will be converted to this currency.
    """
    defaultCurrency: String!
    """
    The user's default exchange. At the start only 1 exchange can be used.
    """
    defaultExchange: Exchange!
    """
    Used to store the exchange in the db
    """
    defaultExchangeMic: String!
  }

  """
  Create a new user settings object when a new user signs up
  """
  input CreateSettings {
    """
    The user's default currency. Everything will be converted to this currency.
    """
    defaultCurrency: String!
    """
    The user's default exchange. At the start only 1 exchange can be used.
    This must be the MIC!
    """
    defaultExchange: String!
    """
    The unique user id
    """
    userId: ID!
  }
  """
  Update only some values.
  """
  input UpdateSettings {
    """
    The user's default currency. Everything will be converted to this currency.
    """
    defaultCurrency: String
    """
    The user's default exchange. At the start only 1 exchange can be used.
    This must be the MIC!
    """
    defaultExchange: String
    """
    The unique user id
    """
    userId: ID!
  }

  """
  An exchange where shares are traded
  """
  type Exchange {
    """
    Exchange abbreviation
    """
    abbreviation: String!

    """
    Market Identifier Code using ISO 10383
    """
    mic: String!

    """
    Full name of the exchange.
    """
    name: String!

    """
    2 letter case insensitive string of country codes using ISO 3166-1 alpha-2
    """
    region: String!

    """
    Exchange Suffix to be added for symbols on that exchange
    """
    suffix: String
  }

  """
  Generic Value and Quantity over time.
  This is used for assets for example.
  """
  type ValueAndQuantityAtTime {
    """
    How many shares/items
    """
    quantity: Float!

    """
    A timestamp when this value and quantity was
    """
    time: Timestamp!

    """
    The value of each share/item
    """
    value: Float!
  }

  """
  The value and volume of an asset over time.
  """
  type AssetHistory {
    """
    For reference
    """
    assetId: String!
    """
    The asset
    """
    asset: ExchangeTradedAsset!

    """
    Value and Quantity for each day
    """
    history: [ValueAndQuantityAtTime!]!
  }

  """
  Anything that has a changing value over time can use this.
  """
  type ValueAtTime {
    """
    A unix timestamp.
    """
    time: Timestamp!
    """
    Can be anything really. Prices, percentages, or something else entirely.
    """
    value: Float!
  }
  """
  The found company from a user search.
  """
  type SearchResult {
    """
    For reference
    """
    assetId: String!
    """
    All company data itself
    """
    asset: ExchangeTradedAsset!
    """
    The isin of the company
    """
    isin: ID!
    """
    The ticker of the company
    """
    ticker: ID!
  }

  """
  Available queries
  """
  type Query {
    # """
    # Return a list of all companies that can be traded at a certain exchange
    # """
    # getAvailableCompaniesAtExchange(
    #   """
    #   The market identifier code
    #   """
    #   mic: String!
    # ): [Company!]!

    """
    Load an exchange traded asset by its id
    """
    exchangeTradedAsset("The globally unique id" id: ID!): ExchangeTradedAsset

    """
    Get a list of all availale exchanges
    """
    exchanges: [Exchange!]!

    """
    Get the risk free rates for a given interval
    """
    riskFreeRates(
      """
      The interval for each datapoint
      """
      interval: Interval!
      """
      Filter the array from this point in time onwards
      """
      begin: Timestamp!
      """
      Optionally set an end date.
      Defaults to "today"
      """
      end: Timestamp
    ): [ValueAtTime!]!
    """
    Return the daily closing prices for a stock at a specific exchange
    """
    stockPricesAtExchange(
      """
      The ticker of a company.
      """
      ticker: String!
      """
      The Market Identifier Code of the exchange.
      """
      mic: String!
      """
      The start time to filter prices
      """
      start: Timestamp!
      """
      Optionally set an end time, defaults to now.
      """
      end: Timestamp
    ): [ValueAtTime!]!

    """
    Return a portfolio by its id
    """
    portfolio(
      """
      The portfolio' unique id
      """
      portfolioId: ID!
    ): Portfolio

    """
    Load a user by their id
    """
    user("The user's id" userId: ID!): User

    """
    Return matching isins for a given search string

    The fragment will be compared against the ticker and company name.
    """
    search(
      """
      A partial search from the user.
      """
      fragment: String!
    ): [SearchResult!]!
  }

  """
  Available mutations
  """
  type Mutation {
    """
    Create a new portfolio
    """
    createPortfolio(
      """
      The portfolio you want to create
      """
      portfolio: CreatePortfolio!
    ): Portfolio!

    """
    Create a new transaction
    """
    createTransaction(
      "A single buy or sell transaction"
      transaction: CreateTransaction!
    ): Transaction

    """
    Create and store settings for the first time. For example when a new user signs up.
    """
    createSettings(
      "A complete settings object that can be written to the databse as is"
      settings: CreateSettings!
    ): Settings!

    """
    Delete a single transaction from the database
    """
    deleteTransaction("The unique id of a transaction" transactionId: ID!): ID!

    """
    Enter the user's email into our newsletter list.
    """
    subscribeToNewsletter("The users email" email: String!): String!

    """
    Only update some values in the user settings.
    """
    updateSettings("A partial settings object" settings: UpdateSettings!): Settings!
  }
`