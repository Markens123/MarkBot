const categories: any = {};

categories.functions = (await import('./functions/index.js')).default;

export default categories;
