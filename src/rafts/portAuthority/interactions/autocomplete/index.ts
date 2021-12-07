const interactions: any = {};

interactions.things = (await import('./things.js')).default;

export default interactions;
