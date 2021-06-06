import { Collection, CreateIndex } from "faunadb"
import { Price } from "db"

export default CreateIndex({
  name: Price.index.bySymbol,
  source: Collection(Price.collection),
  terms: [
    {
      field: ["data", "symbol"],
    },
  ],
  values: [
    { field: ["data", "time"] },
    {
      field: "ref",
    },
  ],
  unique: false,
  serialized: true,
})