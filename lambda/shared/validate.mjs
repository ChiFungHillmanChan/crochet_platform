export function validateProduct(body, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (!body.name?.trim()) errors.push("Name is required");
    if (!body.slug?.trim()) errors.push("Slug is required");
  }

  if (body.slug !== undefined) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) {
      errors.push("Slug must contain only lowercase letters, numbers, and hyphens");
    }
    if (body.slug.length > 100) {
      errors.push("Slug must be 100 characters or less");
    }
  }

  if (body.name !== undefined && body.name.length > 200) {
    errors.push("Name must be 200 characters or less");
  }

  if (body.description !== undefined && body.description.length > 5000) {
    errors.push("Description must be 5000 characters or less");
  }

  if (body.price !== undefined) {
    if (!Number.isInteger(body.price) || body.price < 1 || body.price > 1000000) {
      errors.push("Price must be a positive integer between 1 and 1000000 (pence)");
    }
  }

  if (body.stock !== undefined) {
    if (!Number.isInteger(body.stock) || body.stock < 0 || body.stock > 99999) {
      errors.push("Stock must be a non-negative integer (max 99999)");
    }
  }

  if (body.images !== undefined) {
    if (!Array.isArray(body.images) || body.images.length > 20) {
      errors.push("Images must be an array with max 20 items");
    }
  }

  if (body.categorySlug !== undefined) {
    if (typeof body.categorySlug !== "string" || body.categorySlug.length > 50) {
      errors.push("Invalid category slug");
    }
  }

  return errors;
}

export function validateCheckoutDetails(body) {
  const errors = [];

  if (!body.customerName?.trim()) {
    errors.push("Customer name is required");
  }

  if (!body.customerEmail?.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail)) {
    errors.push("Invalid email format");
  }

  if (!body.customerPhone?.trim()) {
    errors.push("Phone number is required");
  } else if (!/^[\d\s+()-]{7,20}$/.test(body.customerPhone)) {
    errors.push("Invalid phone number format");
  }

  const addr = body.shippingAddress;
  if (!addr) {
    errors.push("Shipping address is required");
  } else {
    if (!addr.line1?.trim()) errors.push("Address line 1 is required");
    if (!addr.city?.trim()) errors.push("City is required");
    if (!addr.postcode?.trim()) errors.push("Postcode is required");
    if (addr.postcode && !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(addr.postcode.trim())) {
      errors.push("Invalid UK postcode format");
    }
    if (!addr.country?.trim()) errors.push("Country is required");
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("At least one item is required");
  }

  return errors;
}
