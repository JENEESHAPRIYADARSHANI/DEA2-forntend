import { UserLayout } from "@/components/layout/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const UserProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Update localStorage
    const stored = localStorage.getItem("starbags_user");
    if (stored) {
      const userData = JSON.parse(stored);
      userData.name = name;
      localStorage.setItem("starbags_user", JSON.stringify(userData));
    }
    
    setIsSaving(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed in demo mode
              </p>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="btn-gradient">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Account Type</p>
                <p className="text-sm text-muted-foreground">Customer Account</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Active
              </span>
            </div>
            <Separator />
            <div>
              <p className="font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground text-center">
            🔒 This is a demo profile. In production, enable Cloud for secure user management.
          </p>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfile;
