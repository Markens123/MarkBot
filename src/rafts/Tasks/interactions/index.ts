const interactions: any = {};

interactions.commands = (await import('./commands/index.js')).default;
interactions.subcommands = (await import('./subcommands/index.js')).default;
interactions.modals = (await import('./modals/index.js')).default;
interactions.selectMenuComponents = (await import('./selectMenuComponents/index.js')).default;
//interactions.buttonComponents = (await import('./buttonComponents/index.js')).default;
//interactions.messageContextMenuComponents = (await import('./contextMenuComponents/index.js')).messages;

export default interactions;
