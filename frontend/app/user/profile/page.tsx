import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="text-lg text-gray-700">
        View and manage your profile information.
      </p>

      {/* Profile Information Section */}
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Personal Information</h2>
        <form className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-2/3 rounded-md border p-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-2/3 rounded-md border p-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Contact Number</label>
            <input
              type="tel"
              placeholder="Enter your contact number"
              className="w-2/3 rounded-md border p-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-lg">Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              className="w-2/3 rounded-md border p-2"
            />
          </div>
          <div className="flex justify-end">
            <Button className="bg-green-500 text-white hover:bg-green-600">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
