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