// Create image editor
var imageEditor = new tui.ImageEditor('#my-image-editor canvas', {
    cssMaxWidth: 1000, // Component default value: 1000
    cssMaxHeight: 800  // Component default value: 800
});

// Load image
imageEditor.loadImageFromURL('https://picsum.photos/500', 'My sample image')