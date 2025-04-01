
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  AtSign, 
  Key, 
  User as UserIcon, 
  Phone, 
  Briefcase, 
  Mail 
} from "lucide-react";

// Define the signup form schema
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userId: z.string().min(1, "ID is required"),
  email: z.string().email("Invalid email address"),
  contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
  post: z.string().min(1, "Post/Position is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      userId: "",
      email: "",
      contactNo: "",
      post: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signup(
        data.name,
        data.userId,
        data.email,
        data.contactNo,
        data.post,
        data.password
      );
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10 opacity-50">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-96 sm:h-96 bg-medical-100 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-96 sm:h-96 bg-medical-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Header */}
      <header className="w-full py-4 sm:py-6 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass px-4 py-3 sm:px-6 sm:py-4 rounded-xl">
            <h1 className="text-xl sm:text-3xl font-medium text-center">
              <span className="text-medical-700">Create</span> an Account
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 sm:px-0 py-4 sm:py-6">
        <div className="glass p-5 sm:p-8 rounded-lg shadow-md border border-white/20 backdrop-blur-lg bg-white/10">
          <div className="flex justify-center mb-4">
            <div className="p-2 sm:p-3 bg-medical-50 rounded-full shadow-md animate-pulse-once">
              <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-medical-700" />
            </div>
          </div>
          
          <p className="text-center text-muted-foreground text-sm mb-5">
            Fill in the details below to sign up
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            className="pl-10 h-10 bg-white/5 border-white/10 focus-visible:ring-medical-500 text-sm"
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">User ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            className="pl-10 h-10 bg-white/5 border-white/10 focus-visible:ring-medical-500 text-sm"
                            placeholder="Choose a user ID"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            className="pl-10 h-10 bg-white/5 border-white/10 focus-visible:ring-medical-500 text-sm"
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Contact Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            className="pl-10 h-10 bg-white/5 border-white/10 focus-visible:ring-medical-500 text-sm"
                            placeholder="Enter your contact number"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="post"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Position/Post</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            className="pl-10 h-10 bg-white/5 border-white/10 focus-visible:ring-medical-500 text-sm"
                            placeholder="Enter your position/post"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            className="pl-10 h-10 bg-white/5 border-white/10 focus-visible:ring-medical-500 text-sm"
                            type="password"
                            placeholder="Create a password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            className="pl-10 h-10 bg-white/5 border-white/10 focus-visible:ring-medical-500 text-sm"
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto min-w-[120px] h-10 sm:h-12 text-sm sm:text-base font-medium button-hover-effect bg-white/2 hover:bg-gray-300 border-2 border-gray-400 rounded-3xl px-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 block rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Sign Up
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-medical-600 hover:text-medical-700 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
