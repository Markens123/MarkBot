import { Collection, Snowflake } from 'discord.js';
import { Express } from 'express';
import BaseLoop from '../../src/loops/BaseLoop.js';
import ListAPI from '../../src/rafts/Anime/apis/list.js';
import OauthAPI from '../../src/rafts/Anime/apis/oauth.js';
import AQueueCommand from '../../src/rafts/Anime/commands/aqueue.js';
import LinkCommand from '../../src/rafts/Anime/commands/link.js';
import MALCommand from '../../src/rafts/Anime/commands/mal.js';
import SauceCommand from '../../src/rafts/Anime/commands/sauce.js';
import UnlinkCommand from '../../src/rafts/Anime/commands/unlink.js';
import Anime from '../../src/rafts/Anime/index.js';
import AQueueAddInteraction from '../../src/rafts/Anime/interactions/buttonComponents/aqueue_add.js';
import AQueueDeleteInteraction from '../../src/rafts/Anime/interactions/buttonComponents/aqueue_delete.js';
import AQueueReorderInteraction from '../../src/rafts/Anime/interactions/buttonComponents/aqueue_reorder.js';
import HAlertsEditInteraction from '../../src/rafts/Anime/interactions/buttonComponents/halerts_edit.js';
import HAlertsResetInteraction from '../../src/rafts/Anime/interactions/buttonComponents/halerts_reset.js';
import HAlertsInteraction from '../../src/rafts/Anime/interactions/commands/halerts.js';
import MALInteraction from '../../src/rafts/Anime/interactions/commands/mal.js';
import SauceInteraction from '../../src/rafts/Anime/interactions/contextMenuComponents/messages/sauce.js';
import MALGetInteraction from '../../src/rafts/Anime/interactions/subcommands/mal/mal_get.js';
import MALlinkInteraction from '../../src/rafts/Anime/interactions/subcommands/mal/mal_link.js';
import MALMyListInteraction from '../../src/rafts/Anime/interactions/subcommands/mal/mal_mylist.js';
import MALSearchInteraction from '../../src/rafts/Anime/interactions/subcommands/mal/mal_search.js';
import MALUnlinkInteraction from '../../src/rafts/Anime/interactions/subcommands/mal/mal_unlink.js';
import CaptainsLog from '../../src/rafts/captainsLog/index.js';
import DogAPI from '../../src/rafts/lighthouse/apis/dog.js';
import NasaAPI from '../../src/rafts/lighthouse/apis/nasa.js';
import AbstractCommand from '../../src/rafts/lighthouse/commands/abstract.js';
import EmojiCommand from '../../src/rafts/lighthouse/commands/emoji.js';
import FractalCommand from '../../src/rafts/lighthouse/commands/fractal.js';
import PuppyCommand from '../../src/rafts/lighthouse/commands/puppy.js';
import SpaceCommand from '../../src/rafts/lighthouse/commands/space.js';
import StarsCommand from '../../src/rafts/lighthouse/commands/stars.js';
import TreeCommand from '../../src/rafts/lighthouse/commands/tree.js';
import Lighthouse from '../../src/rafts/lighthouse/index.js';
import GenerateNewInteraction from '../../src/rafts/lighthouse/interactions/buttonComponents/generate_new.js';
import GenerateInteraction from '../../src/rafts/lighthouse/interactions/commands/generate.js';
import GenerateAbstractInteraction from '../../src/rafts/lighthouse/interactions/subcommands/generate/generate_abstract.js';
import GenerateFractalInteraction from '../../src/rafts/lighthouse/interactions/subcommands/generate/generate_fractal.js';
import GeneratePuppyInteraction from '../../src/rafts/lighthouse/interactions/subcommands/generate/generate_puppy.js';
import GenerateSpaceInteraction from '../../src/rafts/lighthouse/interactions/subcommands/generate/generate_space.js';
import GenerateStarsInteraction from '../../src/rafts/lighthouse/interactions/subcommands/generate/generate_stars.js';
import GenerateTreeInteraction from '../../src/rafts/lighthouse/interactions/subcommands/generate/generate_tree.js';
import CEvalCommand from '../../src/rafts/portAuthority/commands/ceval.js';
import DelReminderCommand from '../../src/rafts/portAuthority/commands/delreminder.js';
import EchoCommand from '../../src/rafts/portAuthority/commands/echo.js';
import EvalCommand from '../../src/rafts/portAuthority/commands/eval.js';
import HelloCommand from '../../src/rafts/portAuthority/commands/hello.js';
import PingCommand from '../../src/rafts/portAuthority/commands/ping.js';
import RebootCommand from '../../src/rafts/portAuthority/commands/reboot.js';
import ReloadCommandCommand from '../../src/rafts/portAuthority/commands/reloadcommand.js';
import RemindCommand from '../../src/rafts/portAuthority/commands/remind.js';
import RemindersCommand from '../../src/rafts/portAuthority/commands/reminders.js';
import TestCommand from '../../src/rafts/portAuthority/commands/test.js';
import UpdateCommand from '../../src/rafts/portAuthority/commands/update.js';
import PortAuthority from '../../src/rafts/portAuthority/index.js';
import DateInteraction from '../../src/rafts/portAuthority/interactions/autocomplete/date.js';
import ThingsInteraction from '../../src/rafts/portAuthority/interactions/autocomplete/things.js';
import DeleteInteraction from '../../src/rafts/portAuthority/interactions/buttonComponents/delete.js';
import TestButtonsInteraction from '../../src/rafts/portAuthority/interactions/buttonComponents/test_buttons.js';
import EBallInteraction from '../../src/rafts/portAuthority/interactions/commands/8ball.js';
import AtolInteraction from '../../src/rafts/portAuthority/interactions/commands/atol.js';
import AvatarInteraction from '../../src/rafts/portAuthority/interactions/commands/avatar.js';
import BannerInteraction from '../../src/rafts/portAuthority/interactions/commands/banner.js';
import CheckTFInteraction from '../../src/rafts/portAuthority/interactions/commands/checktf.js';
import DAlertsInteraction from '../../src/rafts/portAuthority/interactions/commands/dalerts.js';
import DisableInteraction from '../../src/rafts/portAuthority/interactions/commands/disable.js';
import DiscordVerInteraction from '../../src/rafts/portAuthority/interactions/commands/discordver.js';
import EnableInteraction from '../../src/rafts/portAuthority/interactions/commands/enable.js';
import EphemeralInteraction from '../../src/rafts/portAuthority/interactions/commands/ephemeral.js';
import NoRespInteraction from '../../src/rafts/portAuthority/interactions/commands/noresp.js';
import OCRInteraction from '../../src/rafts/portAuthority/interactions/commands/ocr.js';
import OnlyMeInteraction from '../../src/rafts/portAuthority/interactions/commands/onlyme.js';
import PingInteraction from '../../src/rafts/portAuthority/interactions/commands/ping.js';
import ReloadInteraction from '../../src/rafts/portAuthority/interactions/commands/reload.js';
import ScheduleInteraction from '../../src/rafts/portAuthority/interactions/commands/schedule.js';
import ShrugInteraction from '../../src/rafts/portAuthority/interactions/commands/shrug.js';
import TestInteraction from '../../src/rafts/portAuthority/interactions/commands/test.js';
import TimestampInteraction from '../../src/rafts/portAuthority/interactions/commands/timestamp.js';
import GuessInteraction from '../../src/rafts/portAuthority/interactions/contextMenuComponents/messages/guess.js';
import TestModalInteraction from '../../src/rafts/portAuthority/interactions/modals/testmodal.js';
import DAlertsConfigInteraction from '../../src/rafts/portAuthority/interactions/subcommands/dalerts/dalerts_config.js';
import DAlertsRoleInteraction from '../../src/rafts/portAuthority/interactions/subcommands/dalerts/dalerts_role.js';
import DAlertsSetInteraction from '../../src/rafts/portAuthority/interactions/subcommands/dalerts/dalerts_set.js';
import Tasks from '../../src/rafts/Tasks/index.js';
import TaskInteraction from '../../src/rafts/Tasks/interactions/commands/tasks.js';
import ItemAddModalInteraction from '../../src/rafts/Tasks/interactions/modals/item_add.js';
import ItemEditModalInteraction from '../../src/rafts/Tasks/interactions/modals/item_edit.js';
import TaskCreateModalInteraction from '../../src/rafts/Tasks/interactions/modals/task_create.js';
import TaskEditModalInteraction from '../../src/rafts/Tasks/interactions/modals/task_edit.js';
import ItemSelectInteraction from '../../src/rafts/Tasks/interactions/selectMenuComponents/item_select.js';
import TaskOptionsInteraction from '../../src/rafts/Tasks/interactions/selectMenuComponents/task_options.js';
import TaskConfigInteraction from '../../src/rafts/Tasks/interactions/subcommands/tasks/tasks_config.js';
import TaskCreateInteraction from '../../src/rafts/Tasks/interactions/subcommands/tasks/tasks_create.js';
import TaskEditInteraction from '../../src/rafts/Tasks/interactions/subcommands/tasks/tasks_edit.js';
import TaskSetupInteraction from '../../src/rafts/Tasks/interactions/subcommands/tasks/tasks_setup.js';
import { BoatOptions, ClientI } from './Main.js';

export interface BoatTest {
  options: BoatOptions;
  client: ClientI;
  owners: Snowflake[];
  prefix: string;
  events: any;
  loops: Collection<string, BaseLoop>;
  token: string;
  debug: boolean;
  ending: boolean;
  log: any;
  end(code: any): Promise<void>;
  readonly toJSON: any;
  launchRaft: any;
  listen: any;
  app: Express;
  rafts: {
    Anime: Anime,
    captiansLog: CaptainsLog,
    lighthouse: Lighthouse,
    portAuthority: PortAuthority,
    Tasks: Tasks
  },
  commands: AnCommands & PaCommands & LhCommands,
  interactions: {
    commands: PaInteractions['commands'] & AnInteractions['commands'] & LhInteractions['commands'] & TaInteractions['commands'],
    autocomplete: PaInteractions['autocomplete'],
    buttonComponents: PaInteractions['buttonComponents'] & AnInteractions['buttonComponents'] & LhInteractions['buttonComponents'],
    modals: PaInteractions['modals'] & TaInteractions['modals'],
    messageContextMenuComponents: PaInteractions['messageContextMenuComponents'] & AnInteractions['messageContextMenuComponents'],
    subcommands: LhInteractions['subcommands'] & PaInteractions['subcommands'] & AnInteractions['subcommands'] & TaInteractions['subcommands'],
    selectMenuComponents: TaInteractions['selectMenuComponents']
  },
}

export type TaInteractions = {
  commands: ColObject<{
    tasks: TaskInteraction
  }>,
  modals: ColObject<{
    TASK_CREATE: TaskCreateModalInteraction,
    TASK_EDIT: TaskEditModalInteraction,
    ITEM_ADD: ItemAddModalInteraction,
    ITEM_EDIT: ItemEditModalInteraction
  }>,
  selectMenuComponents: ColObject<{
    TASK_OPTIONS: TaskOptionsInteraction,
    ITEM_SELECT: ItemSelectInteraction
  }>,
  subcommands: ColObject<{
    tasks: ColObject<{
      config: TaskConfigInteraction,
      create: TaskCreateInteraction,
      edit: TaskEditInteraction,
      setup: TaskSetupInteraction
    }>
  }>
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

export type LhInteractions = {
  buttonComponents: ColObject<{
    GENERATE_NEW: GenerateNewInteraction
  }>,
  commands: ColObject<{
    generate: GenerateInteraction
  }>,
  subcommands: ColObject<{
    generate: ColObject<{
      abstract: GenerateAbstractInteraction,
      fractal: GenerateFractalInteraction,
      puppy: GeneratePuppyInteraction,
      space: GenerateSpaceInteraction,
      stars: GenerateStarsInteraction,
      tree: GenerateTreeInteraction
    }>
  }>
}

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
    dalerts: DAlertsInteraction,
    ping: PingInteraction
  }>,
  autocomplete: ColObject<{
    thing: ThingsInteraction,
    date: DateInteraction,
  }>,
  buttonComponents: ColObject<{
    DELETE: DeleteInteraction,
    TEST_BUTTONS: TestButtonsInteraction
  }>,
  modals: ColObject<{
    TEST: TestModalInteraction,
  }>,
  messageContextMenuComponents: ColObject<{
    guess: GuessInteraction,
  }>,
  subcommands: ColObject<{
    dalerts: ColObject<{
      config: DAlertsConfigInteraction,
      role: DAlertsRoleInteraction,
      set: DAlertsSetInteraction
    }>
  }>
}

export type AnCommands = ColObject<{
  link: LinkCommand,
  mal: MALCommand,
  sauce: SauceCommand,
  unlink: UnlinkCommand,
  aqueue: AQueueCommand,
}>



export type AnApis = {
  oauth: OauthAPI,
  list: ListAPI
}

export type AnInteractions = {
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
    halerts: HAlertsInteraction,
    mal: MALInteraction
  }>,
  subcommands: ColObject<{
    mal: ColObject<{
      get: MALGetInteraction,
      link: MALlinkInteraction,
      mylist: MALMyListInteraction,
      search: MALSearchInteraction,
      unlink: MALUnlinkInteraction
    }>
  }>
}



interface ColObject<Props extends { [key: string]: unknown }> extends Collection<keyof Props, Props[keyof Props]> {
  get<K extends keyof Props>(key: K | string): Props[K];
}

type s = string

let test: BoatTest;
let t: string

