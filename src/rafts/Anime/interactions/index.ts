const interactions: any = {};

interactions.messageContextMenuComponents = (await import('./contextMenuComponents/index.js')).messages;
interactions.buttonComponents = (await import('./buttonComponents/index.js')).default;
interactions.commands = (await import('./commands/index.js')).default;

export default interactions;
