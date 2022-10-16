const commands: any = {};

commands.deploy = (await import('./functions_deploy.js')).default;

export default commands
