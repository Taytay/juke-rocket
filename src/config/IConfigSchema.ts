export interface IConfigSchema {
  /**
   * The schema to validate the config document
   */
  $schema: string;
  /**
   * The version of the config file. Valid values are: '1'
   */
  version: string;
  /**
   * The name of the spotify device used by spotifyd.
   */
  spotifyDeviceName: string;
  /**
   * Absolute path to the input device.
   */
  cardReaderPath: string;
  cards?: ICardData[];
}

export interface ICardData {
  cardId: string;
  action: {
    play:
      | {
          uri: string;
        }
      | {
          name: string;
        };
  };
}
