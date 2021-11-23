const interactions: any = {};

interactions.commands = (await import('./commands/index.js')).default;
interactions.autocomplete = (await import('./autocomplete/index.js')).default;
interactions.buttonComponents = (await import('./buttonComponents/index.js')).default;
interactions.messageContextMenuComponents = (await import('./contextMenuComponents/index.js')).messages;

export default interactions;
