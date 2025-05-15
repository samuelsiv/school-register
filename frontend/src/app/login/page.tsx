import { LoginForm } from "@/components/forms/LoginSchema";
import { isLogged } from "@/lib/auth";

export default function LoginPage() {
	// TODO: Check if the user is already logged in

	return <div className="bg-background text-foreground flex flex-col items-center p-6 gap-6 text-center">
		<h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-5xl">School-Register</h1>
		<br />
		<h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl">Welcome! <br /> Go ahead and login with your school account.</h2>
		<LoginForm />
	</div>
}