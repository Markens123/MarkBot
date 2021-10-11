const rafts: any = {};

rafts.portAuthority = (await import('./portAuthority/index.js')).default;
rafts.captainsLog = (await import('./captainsLog/index.js')).default;
rafts.Anime = (await import('./Anime/index.js')).default;
rafts.lighthouse = (await import('./lighthouse/index.js')).default;
rafts.Schoology = (await import('./Schoology/index.js')).default;
export default rafts;

