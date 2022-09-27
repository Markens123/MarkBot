const categories: any = {};

categories.mal = (await import('./mal/index.js')).default;

export default categories;
