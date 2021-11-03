const interactions: any = {};

interactions.reload = (await import('./reload.js')).default;

export default interactions;
