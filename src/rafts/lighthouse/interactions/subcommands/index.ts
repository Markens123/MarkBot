const categories: any = {};

categories.generate = (await import('./generate/index.js')).default;

export default categories;