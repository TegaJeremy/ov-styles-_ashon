import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://ov-styles.netlify.app/admin/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl text-foreground">Reset Password</h1>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-4" />
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm font-body text-muted-foreground">
              A password reset link has been sent to <span className="text-foreground">{email}</span>. Check your inbox.
            </p>
            <Link to="/admin/login">
              <Button variant="outline" className="gap-2 text-xs tracking-wider uppercase mt-4">
                <ArrowLeft size={13} /> Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-2 block">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="bg-card border-border"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full tracking-wider uppercase text-xs">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <div className="text-center">
              <Link to="/admin/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;