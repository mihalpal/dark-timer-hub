
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

// Placeholder data until we connect with Supabase
const initialCategories = [
  { id: 1, name: "Work" },
  { id: 2, name: "Study" },
  { id: 3, name: "Personal" },
  { id: 4, name: "Health" },
];

const Categories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);
  const [editName, setEditName] = useState("");
  
  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
  };
  
  const handleEditClick = (category: { id: number; name: string }) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setIsSheetOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (selectedCategory && editName.trim()) {
      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id ? { ...cat, name: editName } : cat
      ));
      setIsSheetOpen(false);
    }
  };

  return (
    <div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Categories</CardTitle>
          <CardDescription>
            Manage your timer categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-2 font-medium text-muted-foreground py-2 px-3 border-b border-border">
              <div>Name</div>
              <div>Actions</div>
              <div></div>
            </div>
            
            {categories.length > 0 ? (
              categories.map((category) => (
                <div 
                  key={category.id} 
                  className="grid grid-cols-3 gap-2 py-3 px-3 items-center border-b border-border hover:bg-sidebar-accent/30 cursor-pointer transition-colors"
                  onClick={() => handleEditClick(category)}
                >
                  <div className="font-medium">{category.name}</div>
                  <div>
                    <Button
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                    >
                      <X size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                  <div></div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No categories found. Create your first category to get started.
              </div>
            )}
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-6">
                Note: This is placeholder data. Connect to Supabase to manage real categories.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit category sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              Update the name of your category
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Category name"
                className="w-full"
              />
            </div>
            <Button onClick={handleSaveEdit} className="w-full">
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Categories;
