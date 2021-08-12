/* import OauthAPI from "../../src/rafts/Anime/apis/oauth.js";
import LinkCommand from "../../src/rafts/Anime/commands/link.js";
import MALCommand from "../../src/rafts/Anime/commands/mal.js";
import SauceCommand from "../../src/rafts/Anime/commands/sauce.js";
import BaseCommand from "../../src/rafts/BaseCommand.js";
import BaseRaft from "../../src/rafts/BaseRaft.js";
import DogAPI from "../../src/rafts/lighthouse/apis/dog.js";
import NasaAPI from "../../src/rafts/lighthouse/apis/nasa.js";
import AbstractCommand from "../../src/rafts/lighthouse/commands/abstract.js";
import FractalCommand from "../../src/rafts/lighthouse/commands/fractal.js";
import PuppyCommand from "../../src/rafts/lighthouse/commands/puppy.js";
import SpaceCommand from "../../src/rafts/lighthouse/commands/space.js";
import StarsCommand from "../../src/rafts/lighthouse/commands/stars.js";
import TreeCommand from "../../src/rafts/lighthouse/commands/tree.js";


export interface AnimeI extends BaseRaft {
  commands: {
    link: LinkCommand
    mal: MALCommand
    sauce: SauceCommand
  }
  apis: {
    oauth: OauthAPI
  }
}

export interface AnimeCI extends BaseCommand {
  raft: AnimeI
}

export interface LightI extends BaseRaft {
  commands: {
    abstract: AbstractCommand
    fractal: FractalCommand
    puppy: PuppyCommand
    space: SpaceCommand
    stars: StarsCommand
    tree: TreeCommand
  },
  apis: {
    dog: DogAPI
    nasa: NasaAPI
  }
}

export interface LightCI extends BaseCommand {
  raft: LightI
} */