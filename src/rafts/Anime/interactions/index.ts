const interactions: any = {};

interactions.messageContextMenuComponents = (await import('./contextMenuComponents/index.js')).messages;
interactions.buttonComponents = (await import('./buttonComponents/index.js')).default;

export default interactions;
