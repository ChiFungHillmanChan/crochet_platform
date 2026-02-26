function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Rewrite product detail pages to the placeholder shell.
    // Client-side React reads the real slug from the URL and fetches from Firestore.
    var productMatch = uri.match(/^\/(en|zh-hk)\/products\/([^/]+)\/?$/);
    if (productMatch && productMatch[2] !== 'placeholder') {
        request.uri = '/' + productMatch[1] + '/products/placeholder/index.html';
        return request;
    }

    // Rewrite admin product edit pages to the placeholder shell.
    var editMatch = uri.match(/^\/(en|zh-hk)\/admin\/products\/([^/]+)\/edit\/?$/);
    if (editMatch && editMatch[2] !== 'placeholder') {
        request.uri = '/' + editMatch[1] + '/admin/products/placeholder/edit/index.html';
        return request;
    }

    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    } else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }
    return request;
}
