import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Register</h1>
        <p className="mb-4 text-center text-gray-600">
          Create an account to access the hospital system.
        </p>

        {/* Registration Form */}
        <form className="space-y-4">
          <div>
            <label className="mb-2 block text-lg font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-lg font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-lg font-medium">Role</label>
            <select className="w-full rounded-md border p-2">
              <option value="patient">Patient</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-lg font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="mb-2 block text-lg font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-md border p-2"
            />
          </div>
          <Button className="w-full bg-green-500 text-white hover:bg-green-600">
            Register
          </Button>
        </form>

        {/* Footer Links */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
