import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex-1 px-8 py-8">
      <div className="flex flex-row justify-center gap-4">
        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">#01</p>
          <span>Queing Number</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">#02</p>
          <span>Queing Number</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <div>
            <p className="text-6xl font-bold">#01</p>
            <span>Queing Number</span>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <div className="card flex w-96 max-w-sm flex-col rounded-lg">
            <p className="mb-2 text-lg font-semibold tracking-tight">
              Patient Information
            </p>
            <div className="flex">
              <p>
                <span>Name: </span>Juan Dela Cruz
              </p>
              <p className="pl-8">
                <span>Age: </span>20
              </p>
            </div>

            <hr className="mt-2"></hr>

            <p className="my-2 text-lg font-semibold tracking-tight">
              Assessment
            </p>

            <p>
              <span>Blood Pressure: </span>120/30
            </p>
            <p>
              <span>Reason: </span>Checkup
            </p>
            <div className="flex flex-col pt-6">
              <div className="flex justify-between">
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/patient/queue"
                >
                  Accept
                </Link>
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/patient/queue"
                >
                  Edit
                </Link>
              </div>

              <Link
                className={buttonVariants({ variant: "outline" })}
                href="/patient/queue"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center gap-4">
        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">#01</p>
          <span>Queing Number</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <p className="text-6xl font-bold">#02</p>
          <span>Queing Number</span>
        </div>

        <div className="card flex h-96 w-80 max-w-sm flex-col items-center justify-center">
          <div>
            <p className="text-6xl font-bold">#01</p>
            <span>Queing Number</span>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <div className="card flex w-96 max-w-sm flex-col rounded-lg">
            <p className="mb-2 text-lg font-semibold tracking-tight">
              Patient Information
            </p>
            <div className="flex">
              <p>
                <span>Name: </span>Juan Dela Cruz
              </p>
              <p className="pl-8">
                <span>Age: </span>20
              </p>
            </div>

            <hr className="mt-2"></hr>

            <p className="my-2 text-lg font-semibold tracking-tight">
              Assessment
            </p>

            <p>
              <span>Blood Pressure: </span>120/30
            </p>
            <p>
              <span>Reason: </span>Checkup
            </p>
            <div className="flex flex-col pt-6">
              <div className="flex justify-between">
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/patient/queue"
                >
                  Accept
                </Link>
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/patient/queue"
                >
                  Edit
                </Link>
              </div>

              <Link
                className={buttonVariants({ variant: "outline" })}
                href="/patient/queue"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
