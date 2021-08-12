'use strict';

const interactions: any = {};

interactions.messageContextMenuComponents = (await import('./contextMenuComponents/index.js')).messages;

export default interactions;
