import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">About Us</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Our Hospital</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We are a patient-focused medical facility dedicated to delivering
              quality healthcare services with compassion, innovation, and
              excellence. Our team of professionals ensures every patient
              receives the care they deserve.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              To provide comprehensive, accessible, and affordable healthcare
              services to the community, with a focus on continuous improvement
              and patient satisfaction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              To be the leading healthcare provider known for exceptional
              medical care, advanced technology, and a compassionate approach to
              healing.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Core Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
              <li>Compassion</li>
              <li>Integrity</li>
              <li>Excellence</li>
              <li>Teamwork</li>
              <li>Innovation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
