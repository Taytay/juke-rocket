import Ajv, { JSONSchemaType } from "ajv";
import { readFileSync } from "fs";
import path from "path";
import { ICardData, IConfigSchema } from "./IConfigSchema";

export class ConfigReader {
  constructor(configFilename: string) {
    configFilename = path.resolve(configFilename);
    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    const configSchema = JSON.parse(
      readFileSync(path.resolve("./config.schema.json")).toString()
    );
    const configData = JSON.parse(readFileSync(configFilename).toString());
    const schema: JSONSchemaType<IConfigSchema> = configSchema;
    const validate = ajv.compile(schema);
    if (validate(configData)) {
      this.config = configData;
    } else {
      throw new Error(JSON.stringify(validate.errors));
    }
  }

  public getCardData(cardId: string): ICardData | undefined {
    return this.config.cards?.find((currentCard) => {
      return currentCard.cardId == cardId;
    });
  }

  public readonly config: IConfigSchema;
}
