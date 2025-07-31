"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutUs() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            About Our Hospital
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-lg md:text-xl"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            Delivering compassionate, innovative, and exceptional healthcare to
            our community.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  To provide excellent healthcare and the delivery of quality
                  health services to all its clients.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  To be a quality birthing home service that shall be responsive
                  to the health needs of its clients.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Our Core Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="ml-5 list-disc space-y-2">
                  <li>Compassion</li>
                  <li>Integrity</li>
                  <li>Excellence</li>
                  <li>Teamwork</li>
                  <li>Innovation</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Section */}
        <section className="mt-16 text-center">
          <motion.h2
            className="mb-6 text-3xl font-bold"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            Why Choose Us?
          </motion.h2>
          <motion.p
            className="mx-auto mb-8 max-w-3xl"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            Our hospital combines cutting-edge technology with a
            patient-centered approach. Our dedicated team of professionals is
            committed to your well-being, ensuring personalized care in a
            welcoming environment.
          </motion.p>
        </section>
      </main>

      {/* Footer Call-to-Action */}
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="mb-4 text-2xl font-bold md:text-3xl"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            Ready to Experience Exceptional Care?
          </motion.h2>
          <motion.a
            href="/contact"
            className="inline-block rounded-full bg-foreground px-6 py-3 font-semibold transition-colors"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            Contact Us Today
          </motion.a>
        </div>
      </section>
    </div>
  );
}