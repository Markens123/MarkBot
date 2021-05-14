'use strict';

exports.makeid = (length) => {
  var result = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}
exports.hreadable = (text) => {
  let str = text.split('_').join(' ')
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

exports.promiseExec = (action, exec) => {
  return new Promise((resolve, reject) =>
    exec(action, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    }),
  );
}

exports.clean = (text, redact = false) => {
  if (typeof text === 'string') {
    /* client.maldata.fetchEverything().forEach(element => {
      text = text.replace(element.AToken, 'Redacted')
      .replace(element.RToken, 'Redacted')
    }); */ 
    text
      .replace(/` /g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
  if (redact) text
      .replace(this.boat.token, 'Redacted')
      .replace(this.boat.options.log.webhookToken, 'Redacted');
  }
  return text;
}
