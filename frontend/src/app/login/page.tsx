"use client"

import {useEffect, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Turnstile} from 'next-turnstile';
import {preload} from "swr";
import {fetcher, request} from "@/lib/request";

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {LockIcon, MailIcon, Shield} from "lucide-react";
import {redirect} from "next/navigation";
import {UserInfo} from "@/types/userInfo";
import {Config} from "@/types/config";

const loginSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password is too short!"}),
    captcha: z.string({required_error: "Captcha is required"}).min(6, {message: "Captcha is required"}),
});

function LoginForm() {
    const [turnstileSiteKey, setTurnstileSiteKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDemo, setDemo] = useState<boolean>(false)

    useEffect(() => {
        request("GET", "/api/v1/misc/config").then((json: Config) => {
            setTurnstileSiteKey(json.turnstile.siteKey);
            setDemo(json.features.demo)
        });
    }, []);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            captcha: ""
        },
    });

    function onSubmit(values: object) {
        setIsLoading(true);
        request("POST", "/api/v1/auth/login", {
            data: values
        })
            .then((data) => {
                if (!data.success) {
                    const errorMessage = Array.isArray(data.error?.issues)
                        ? data.error.issues.map((issue: {
                            message: string;
                        }) => issue.message).join(", ")
                        : data.error?.message || data.error ? data.error : "Login failed. Please check your credentials.";

                    form.setError("root", {message: errorMessage});
                    return;
                }

                document.cookie = "auth_token=" + data.token + "; Max-Age=3600";
                preload("/api/v1/user", fetcher)
                    .then((data: {
                        success: boolean,
                        user: UserInfo
                    }) => {
                        if (data.user.role == "student" || data.user.role == "parent") {
                            redirect("/student");
                        } else if (data.user.role == "teacher") {
                            redirect("/teachers");
                        } else {
                            redirect("/admin");
                        }
                    })
            })
            .catch((err) => {
                console.log(err);
                form.setError("root", {message: "An error occurred while logging in. Please try again."});
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <Card className="w-full max-w-md shadow-lg mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                    Login with your school account credentials<br/>
                    <p style={{display: isDemo ? "initial" : "none"}}>Demo credentials:<br/>- <b>Student</b>: student@demo.local : demo123<br/>- <b>Teacher</b>: teacher@demo.local : demo123<br/>- <b>Admin</b>: admin@demo.local : demo123</p>
                </CardDescription>

            </CardHeader>
            <CardContent>
                <Form {...form}>
                    {form.formState.errors.root && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>
                                {form.formState.errors.root.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div
                                            className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
											<span className="px-3 text-muted-foreground">
												<MailIcon size={18}/>
											</span>
                                            <Input
                                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                type="email"
                                                placeholder="email@school.edu.it"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div
                                            className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-input">
											<span className="px-3 text-muted-foreground">
												<LockIcon size={18}/>
											</span>
                                            <Input
                                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="captcha"
                            render={({field}) => (
                                <FormItem className="space-y-2">
                                    <div className="flex justify-center">
                                        {turnstileSiteKey !== "" ? (
                                            <Turnstile
                                                onVerify={(token) => {
                                                    field.onChange(token);
                                                }}
                                                onError={(e) => console.log(e)}
                                                siteKey={turnstileSiteKey}
                                            />
                                        ) : (
                                            <div
                                                className="h-20 w-full bg-muted rounded-md flex items-center justify-center">
                                                <Shield className="h-6 w-6 text-muted-foreground animate-pulse"/>
                                            </div>
                                        )}
                                    </div>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Need help? Contact your school administrator
                </p>
            </CardFooter>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center w-full h-full p-4">
            <div className="w-full max-w-md mx-auto space-y-6 text-center mb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-primary">School Register</h1>
            </div>

            <div className="w-full flex justify-center">
                <LoginForm/>
            </div>
        </div>
    );
}