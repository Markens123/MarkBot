const categories: any = {};

categories.dalerts = (await import('./dalerts/index.js')).default;

export default categories;
