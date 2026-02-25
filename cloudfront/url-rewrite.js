function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Rewrite product detail pages to the placeholder shell.
    // Matches both /en/products/slug/ and /en/products/slug/index.txt (RSC payload)
    var productMatch = uri.match(/^\/(en|zh-hk)\/products\/([^/]+)\/(index\.txt)?$/);
    if (productMatch && productMatch[2] !== 'placeholder') {
        var suffix = productMatch[3] || 'index.html';
        request.uri = '/' + productMatch[1] + '/products/placeholder/' + suffix;
        return request;
    }

    // Rewrite admin product edit pages to the placeholder shell.
    var editMatch = uri.match(/^\/(en|zh-hk)\/admin\/products\/([^/]+)\/edit\/(index\.txt)?$/);
    if (editMatch && editMatch[2] !== 'placeholder') {
        var suffix = editMatch[3] || 'index.html';
        request.uri = '/' + editMatch[1] + '/admin/products/placeholder/edit/' + suffix;
        return request;
    }

    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    } else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }
    return request;
}
