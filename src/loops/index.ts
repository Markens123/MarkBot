const loops: any = {};

loops.hentai = (await import('./hloop.js')).default;
loops.anime = (await import('./aloop.js')).default;

export default loops;
