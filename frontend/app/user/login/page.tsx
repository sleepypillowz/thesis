import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>

        {/* Login Form */}
        <form className="space-y-4">
          <div>
            <label className="mb-2 block text-lg font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-lg font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-md border p-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className="text-gray-600">
                Remember Me
              </label>
            </div>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
          <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
            Login
          </Button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center">
          <div className="h-px flex-grow bg-gray-300"></div>
          <span className="px-2 text-gray-600">OR</span>
          <div className="h-px flex-grow bg-gray-300"></div>
        </div>

        {/* Google Login Option */}
        <Button className="w-full bg-red-500 text-white hover:bg-red-600">
          Login with Google
        </Button>

        {/* Footer Links */}
        <p className="mt-4 text-center text-gray-600">
          Dont have an account?{" "}
          <a href="/user/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
