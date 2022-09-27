const categories: any = {};

categories.tasks = (await import('./tasks/index.js')).default;

export default categories;
