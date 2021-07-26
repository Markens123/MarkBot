'use strict';
const getHTML = require('html-get');
const getHtmlTitle = require('vamtiger-get-html-title').default;

exports.experiments =
[
"2021-04_product_rebrand",
"2020-11_expression_suggestions",
"2021-02_mobile_expression_suggestions",
"2021-05_premium_increased_content_length",
"2021-05_stage_public_toggle_users",
"2021-04_stage_discovery",
"2021-03_mobile_web_scroll_experiment",
"2021-05_per_guild_avatars",
"2021-05_custom_profiles_premium",
"2021-04_premium_increased_max_guilds",
"2021-05_application_command_callout",
"2021-05_application_command_suggestions",
"2021-04_friend_nicknames" 
];

exports.checkTF = async (url) => {
  const { html } = await getHTML(url)
  let title = getHtmlTitle({ html });
  title = title.slice(9).replace(' beta - TestFlight - Apple','');
  return {full: html.includes("This beta is full."), title}
}

exports.LogLevels = {
  console: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    verbose: 5,
  },
  webhook: {
    error: 'BRIGHT_RED',
    warn: 'DEEP_GOLD',
  },
};

exports.LogColors = {
  critical: 'bold white redBG',
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green',
  verbose: 'blue',
};

exports.DiscordColors = {
  BRIGHT_RED: 0xff0000,
  CYAN: 0x00ffff,
  DEEP_GOLD: 0xffab32,
};

exports.ComponentFunctions = createEnum([]);

function createEnum(keys) {
  const obj = {};
  for (const [index, key] of keys.entries()) {
    if (key === null) continue;
    obj[key] = index;
    obj[index] = key;
  }
  return obj;
}

  const codeblockRegex = /(?:```(?<language>[A-Za-z0-9\\-\\.]*)\n)(?<content>[\s\S]+)(?:```)/im;

exports.getCodeblockMatch = (argument) => {
  const match = codeblockRegex.exec(argument);
  const groups = match?.groups;
  if (groups) {
    const { language, content } = groups;
    if (content && language) return { language, content };
    else if (content) return { content };
  } else return { content: argument };
}