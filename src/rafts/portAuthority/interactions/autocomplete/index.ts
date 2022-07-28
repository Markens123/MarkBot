const interactions: any = {};

interactions.things = (await import('./things.js')).default;
interactions.date = (await import('./date.js')).default;

export default interactions;
