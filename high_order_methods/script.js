const products = [
	{name: "Smartphone", price: 800, category: "electronics"},
	{name: "Headphones", price: 150, category: "electronics"},
	{name: "Coffee Maker", price: 100, category: "home appliances"},
	{name: "Blender", price: 250, category: "home appliances"},
	{name: "Laptop", price: 1200, category: "electronics"},
	{name: "T-shirt", price: 50, category: "clothing"},
	{name: "Sneakers", price: 300, category: "clothing"}
];



// get products with a price under 200 with filter
let products_under_200 = products.filter((product) => {
	return product.price < 200;
});

console.log(products_under_200);



// get an array of product names 
let product_names = products.map((product) => {
	return product.name;
});

console.log(product_names);



// get an array of products within "electronics" category
let electronic_products = products.filter((product) => {
	return product.category == "electronics";
});

// get an array of the names from the previously obtained array of electronic products
let electronic_products_names = electronic_products.map((electronic_product) => {
	return electronic_product.name;
});

console.log(electronic_products_names);



// get an array of all products at or over 1000 in price, then return true if there are any items in the array
let has_any_products_at_or_over_1000 = products.filter((product) => {
	return product.price >= 1000;
}).length > 0;

console.log(has_any_products_at_or_over_1000);



// add up the price of all products with reduce and make sure its an integer
let total_shop_value = products.reduce((total, current_value) => {
	return Math.round(total + current_value.price);
}, 0);

console.log(total_shop_value);