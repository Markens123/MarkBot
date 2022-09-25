const interactions: any = {};

interactions.commands = (await import('./commands/index.js')).default;
interactions.subcommands = (await import('./subcommands/index.js')).default;
interactions.modals = (await import('./modals/index.js')).default;
interactions.selectMenuComponents = (await import('./selectMenuComponents/index.js')).default;

export default interactions;
