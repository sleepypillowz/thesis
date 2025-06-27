import StatsCard from "@/components/organisms/patient-stats-cards";
import { PerformanceHeartRateChart } from "@/components/organisms/performance-heart-rate-chart";
import { RestingHeartRateChart } from "@/components/organisms/resting-heart-rate-chart";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

export default function Page() {
  return (
    <div className="mx-8 my-8 grid grid-cols-2 gap-4 space-y-4">
      <section className="col-span-2">
        <div className="card">
          <div className="grid grid-cols-3">
            <AspectRatio ratio={16 / 9}>
              <Image
                src="/Welcome.png"
                alt="Welcome"
                fill
                className="h-full w-full rounded-lg object-cover"
              />
            </AspectRatio>

            <div className="col-span-2 flex flex-col content-center space-y-4 p-12">
              <span className="font-semibold">Welcome back</span>
              <span className="text-2xl font-bold text-blue-500">
                Cara Stevens!
              </span>
              <p className="text-muted-foreground">
                We would like to take this opportunity to welcome you to our
                practice and to thank you for choosing our physicians to
                participate in your healthcare. We look forward to providing you
                with personalized, comprehensive health care focusing on
                wellness and prevention.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="col-span-2">
        <StatsCard />
      </section>
      <section className="col-span-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <RestingHeartRateChart />
          </div>
          <div>
            <PerformanceHeartRateChart />
          </div>
        </div>
      </section>
    </div>
  );
}
