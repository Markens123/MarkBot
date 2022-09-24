/*import { Collection } from "discord.js";
import ListAPI from "../../src/rafts/Anime/apis/list.js";
import OauthAPI from "../../src/rafts/Anime/apis/oauth.js";
import AQueueCommand from "../../src/rafts/Anime/commands/aqueue.js";
import LinkCommand from "../../src/rafts/Anime/commands/link.js";
import MALCommand from "../../src/rafts/Anime/commands/mal.js";
import SauceCommand from "../../src/rafts/Anime/commands/sauce.js";
import UnlinkCommand from "../../src/rafts/Anime/commands/unlink.js";
import Anime from "../../src/rafts/Anime/index.js";
import AQueueAddInteraction from "../../src/rafts/Anime/interactions/buttonComponents/aqueue_add.js";
import AQueueDeleteInteraction from "../../src/rafts/Anime/interactions/buttonComponents/aqueue_delete.js";
import AQueueReorderInteraction from "../../src/rafts/Anime/interactions/buttonComponents/aqueue_reorder.js";
import HAlertsEditInteraction from "../../src/rafts/Anime/interactions/buttonComponents/halerts_edit.js";
import HAlertsResetInteraction from "../../src/rafts/Anime/interactions/buttonComponents/halerts_reset.js";
import HAlertsInteraction from "../../src/rafts/Anime/interactions/commands/halerts.js";
import SauceInteraction from "../../src/rafts/Anime/interactions/contextMenuComponents/messages/sauce.js";
import BaseCommand from "../../src/rafts/BaseCommand.js";
import BaseRaft from "../../src/rafts/BaseRaft.js";
import CaptainsLog from "../../src/rafts/captainsLog/index.js";
import DogAPI from "../../src/rafts/lighthouse/apis/dog.js";
import NasaAPI from "../../src/rafts/lighthouse/apis/nasa.js";
import AbstractCommand from "../../src/rafts/lighthouse/commands/abstract.js";
import EmojiCommand from "../../src/rafts/lighthouse/commands/emoji.js";
import FractalCommand from "../../src/rafts/lighthouse/commands/fractal.js";
import PuppyCommand from "../../src/rafts/lighthouse/commands/puppy.js";
import SpaceCommand from "../../src/rafts/lighthouse/commands/space.js";
import StarsCommand from "../../src/rafts/lighthouse/commands/stars.js";
import TreeCommand from "../../src/rafts/lighthouse/commands/tree.js";
import Lighthouse from "../../src/rafts/lighthouse/index.js";
import CEvalCommand from "../../src/rafts/portAuthority/commands/ceval.js";
import DelReminderCommand from "../../src/rafts/portAuthority/commands/delreminder.js";
import EchoCommand from "../../src/rafts/portAuthority/commands/echo.js";
import EvalCommand from "../../src/rafts/portAuthority/commands/eval.js";
import HelloCommand from "../../src/rafts/portAuthority/commands/hello.js";
import PingCommand from "../../src/rafts/portAuthority/commands/ping.js";
import RebootCommand from "../../src/rafts/portAuthority/commands/reboot.js";
import ReloadCommandCommand from "../../src/rafts/portAuthority/commands/reloadcommand.js";
import RemindCommand from "../../src/rafts/portAuthority/commands/remind.js";
import RemindersCommand from "../../src/rafts/portAuthority/commands/reminders.js";
import TestCommand from "../../src/rafts/portAuthority/commands/test.js";
import UpdateCommand from "../../src/rafts/portAuthority/commands/update.js";
import PortAuthority from "../../src/rafts/portAuthority/index.js";
import DateInteraction from "../../src/rafts/portAuthority/interactions/autocomplete/date.js";
import ThingsInteraction from "../../src/rafts/portAuthority/interactions/autocomplete/things.js";
import DeleteInteraction from "../../src/rafts/portAuthority/interactions/buttonComponents/delete.js";
import EBallInteraction from "../../src/rafts/portAuthority/interactions/commands/8ball.js";
import AtolInteraction from "../../src/rafts/portAuthority/interactions/commands/atol.js";
import AvatarInteraction from "../../src/rafts/portAuthority/interactions/commands/avatar.js";
import BannerInteraction from "../../src/rafts/portAuthority/interactions/commands/banner.js";
import CheckTFInteraction from "../../src/rafts/portAuthority/interactions/commands/checktf.js";
import DisableInteraction from "../../src/rafts/portAuthority/interactions/commands/disable.js";
import DiscordVerInteraction from "../../src/rafts/portAuthority/interactions/commands/discordver.js";
import EnableInteraction from "../../src/rafts/portAuthority/interactions/commands/enable.js";
import EphemeralInteraction from "../../src/rafts/portAuthority/interactions/commands/ephemeral.js";
import NoRespInteraction from "../../src/rafts/portAuthority/interactions/commands/noresp.js";
import OCRInteraction from "../../src/rafts/portAuthority/interactions/commands/ocr.js";
import OnlyMeInteraction from "../../src/rafts/portAuthority/interactions/commands/onlyme.js";
import ReloadInteraction from "../../src/rafts/portAuthority/interactions/commands/reload.js";
import ScheduleInteraction from "../../src/rafts/portAuthority/interactions/commands/schedule.js";
import ShrugInteraction from "../../src/rafts/portAuthority/interactions/commands/shrug.js";
import TestInteraction from "../../src/rafts/portAuthority/interactions/commands/test.js";
import TimestampInteraction from "../../src/rafts/portAuthority/interactions/commands/timestamp.js";
import GuessInteraction from "../../src/rafts/portAuthority/interactions/contextMenuComponents/messages/guess.js";
import TestModalInteraction from "../../src/rafts/portAuthority/interactions/modals/testmodal.js";
import { BoatI } from "./Main.js";

export interface BoatTest extends BoatI {
  rafts: {
    Anime: Anime,
    captiansLog: CaptainsLog,
    lighthouse: Lighthouse,
    portAuthority: PortAuthority
  },
  commands: AnimeCommands & PaCommands & LhCommands,
  interactions: {
    commands: PaInteractions['commands'] & AnimeInteractions['commands'],
    autocomplete: PaInteractions['autocomplete'],
    buttonComponents: PaInteractions['buttonComponents'] & AnimeInteractions['buttonComponents'],
    modals: PaInteractions['modals'],
    messageContextMenuComponents: PaInteractions['messageContextMenuComponents'] & AnimeInteractions['messageContextMenuComponents']  
  },
  
}


export type LhCommands = ColObject<{
  abstract: AbstractCommand,
  fractal: FractalCommand,
  stars: StarsCommand,
  tree: TreeCommand,
  space: SpaceCommand,
  puppy: PuppyCommand,
  emoji: EmojiCommand
}>

export type LhApis = {
  nasa: NasaAPI,
  dog: DogAPI
}

export type PaCommands = ColObject<{
  ceval: CEvalCommand,
  eval: EvalCommand,
  ping: PingCommand,
  echo: EchoCommand,
  hello: HelloCommand,
  reboot: RebootCommand,
  update: UpdateCommand,
  reloadcommand: ReloadCommandCommand,
  remind: RemindCommand,
  reminders: RemindersCommand,
  delreminder: DelReminderCommand,
  test: TestCommand
}>

export type PaInteractions = {
  commands: ColObject<{
    '8ball': EBallInteraction,
    atol: AtolInteraction,
    avatar: AvatarInteraction,
    checktf: CheckTFInteraction,
    discordver: DiscordVerInteraction,
    shrug: ShrugInteraction,
    test: TestInteraction,
    noresp: NoRespInteraction,
    onlyme: OnlyMeInteraction,
    ephemeral: EphemeralInteraction,
    schedule: ScheduleInteraction,
    reload: ReloadInteraction,
    banner: BannerInteraction,
    enable: EnableInteraction,
    disable: DisableInteraction,
    timestamp: TimestampInteraction,
    ocr: OCRInteraction,
  }>,
  autocomplete: ColObject<{
    thing: ThingsInteraction,
    date: DateInteraction,
  }>,
  buttonComponents: ColObject<{
    DELETE: DeleteInteraction,
  }>,
  modals: ColObject<{
    TEST: TestModalInteraction,
  }>,
  messageContextMenuComponents: ColObject<{
    guess: GuessInteraction,
  }>,
}

export type AnimeCommands = ColObject<{
  link: LinkCommand,
  mal: MALCommand,
  sauce: SauceCommand,
  unlink: UnlinkCommand,
  aqueue: AQueueCommand,
}>

export type AnimeApis = {
  oauth: OauthAPI,
  list: ListAPI
}

export type AnimeInteractions = {
  messageContextMenuComponents: ColObject<{
    sauce: SauceInteraction
  }>,
  buttonComponents: ColObject<{
    AQUEUE_ADD: AQueueAddInteraction,
    AQUEUE_DELETE: AQueueDeleteInteraction,
    AQUEUE_REORDER: AQueueReorderInteraction,
    HALERTS_RESET: HAlertsResetInteraction,
    HALERTS_EDIT: HAlertsEditInteraction
  }>,
  commands: ColObject<{
    halerts: HAlertsInteraction
  }>
}

interface ColObject<Props extends { [key : string] : unknown }> extends Collection<keyof Props, Props[keyof Props]> {
  get<K extends keyof Props>(key : K) : Props[K];
}
*/