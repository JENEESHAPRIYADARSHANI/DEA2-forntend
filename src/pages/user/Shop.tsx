import { UserLayout } from "@/components/layout/UserLayout";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Filter } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Mock product data
const PRODUCTS = [
  {
    id: "1",
    name: "Executive Leather Briefcase",
    description: "Premium leather briefcase for professionals",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    category: "Briefcases",
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    id: "2",
    name: "Urban Travel Backpack",
    description: "Stylish and functional travel companion",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Backpacks",
    rating: 4.6,
    reviews: 89,
    inStock: true,
  },
  {
    id: "3",
    name: "Classic Tote Bag",
    description: "Elegant everyday tote for work and leisure",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    category: "Totes",
    rating: 4.9,
    reviews: 156,
    inStock: true,
  },
  {
    id: "4",
    name: "Vintage Messenger Bag",
    description: "Timeless design with modern functionality",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
    category: "Messenger",
    rating: 4.5,
    reviews: 67,
    inStock: true,
  },
  {
    id: "5",
    name: "Weekend Duffle Bag",
    description: "Spacious duffle for short trips",
    price: 229.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Duffle",
    rating: 4.7,
    reviews: 92,
    inStock: false,
  },
  {
    id: "6",
    name: "Minimalist Laptop Sleeve",
    description: "Slim protection for your laptop",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.4,
    reviews: 45,
    inStock: true,
  },
];

const CATEGORIES = ["All", "Briefcases", "Backpacks", "Totes", "Messenger", "Duffle", "Accessories"];

const Shop = () => {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    if (!product.inStock) {
      toast.error("This product is out of stock");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12 overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Premium Bags Collection
            </h1>
            <p className="text-muted-foreground max-w-md">
              Discover our curated selection of high-quality bags designed for style and functionality.
            </p>
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "btn-gradient" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Badge variant="secondary">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={product.inStock ? "btn-gradient" : ""}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Shop;
