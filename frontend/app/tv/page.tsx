import QueueCard from "./queue-card";

export default function Page() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        👋 Welcome! Please wait while we process your registration
      </h1>
      <QueueCard />
      <p className="text-lg text-gray-600">Thank you for your patience 💙</p>
    </div>
  );
}
